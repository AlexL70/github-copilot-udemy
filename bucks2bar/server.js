// This is not in your workspace, but you could deploy it yourself
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());

app.post('/send-chart', async (req, res) => {
    const { email, chartImage } = req.body;
    // Get Resend API key from the RESEND_API environment variable
    const resendApiKey = process.env.RESEND_API;
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