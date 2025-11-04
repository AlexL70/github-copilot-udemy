// This is not in your workspace, but you could deploy it yourself
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
// Allow CORS from localhost (with any port)
app.use(cors({
    origin: /http:\/\/localhost(:\d+)?/
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());

// Non-deterministic dummy data endpoint
app.get('/dummy-data', (req, res) => {
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];
    // Generate random income and expenses for each month
    const income = months.map(() => Math.floor(Math.random() * 5000) + 2000); // 2000-7000
    const expenses = months.map(() => Math.floor(Math.random() * 3000) + 1000); // 1000-4000
    res.json({ months, income, expenses });
});

app.post('/send-chart', async (req, res) => {
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, chartImage } = req.body;
    if (!emailValidator.test(email)) {
        const errorMessage = `Invalid email address: ${email}`;
        console.log(errorMessage);
        return res.status(400).json({ message: errorMessage });
    }
    // Get Resend API key from the RESEND_API environment variable
    const resendApiKey = process.env.RESEND_API;
    if (!resendApiKey) {
        return res.status(500).json({ message: 'Missing RESEND_API key' });
    }
    // Validate email and chartImage here
    const transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'resend', // Resend SMTP username
            pass: resendApiKey // Use the Resend API key from the environment variable
        }
    });
    const emailOptions = {
        from: 'test@resend.dev',
        to: email,
        subject: 'Your Chart',
        html: '<p>See attached chart.</p>',
        attachments: [{ filename: 'chart.png', path: chartImage }]
    };
    await transporter.sendMail(emailOptions);
    // Return success response with message
    console.log(`Chart sent to ${email}`);
    console.log(`Chart image data: ${chartImage.substring(0, 30)}...`); // Log first 30 chars
    res.status(200).json({ message: 'Chart sent successfully' });
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});