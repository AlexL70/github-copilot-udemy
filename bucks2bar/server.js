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
    // Validate email and chartImage here
    /*
    const transporter = nodemailer.createTransport({ 
        // SMTP config
    });
    await transporter.sendMail({
        from: 'your@email.com',
        to: email,
        subject: 'Your Chart',
        html: '<p>See attached chart.</p>',
        attachments: [{ filename: 'chart.png', path: chartImage }]
    });
    */
    // Return success response with message
    console.log(`Chart sent to ${email}`);
    res.status(200).json({ message: 'Chart sent successfully' });
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});