const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

const sendEmail = async (to, subject, content) => {
    try {
        // Check if content is HTML or plain text
        const isHTML = content.includes('<html') || content.includes('<div') || content.includes('<p>');

        const mailOptions = {
            from: `"Visitor Management System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            ...(isHTML ? { html: content } : { text: content })
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Send email with attachments
const sendEmailWithAttachment = async (to, subject, content, attachments) => {
    try {
        const isHTML = content.includes('<html') || content.includes('<div') || content.includes('<p>');

        const mailOptions = {
            from: `"Visitor Management System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            ...(isHTML ? { html: content } : { text: content }),
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email with attachment sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Error sending email with attachment:', error);
        throw error;
    }
};

module.exports = { sendEmail, sendEmailWithAttachment };