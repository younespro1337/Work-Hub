require('dotenv').config();
const nodemailer = require('nodemailer');

// Create the email transporter
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: { 
        user: process.env.SMTP_MAIL, 
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Email sending function
const sendEmail = async (data) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL, 
            to: data.email,
            subject: data.subject,
            html: data.html
        };

    const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
