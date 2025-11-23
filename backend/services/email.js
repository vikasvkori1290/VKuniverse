const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Send notification email to admin when new contact message arrives
const sendNotificationEmail = async (message) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"VKuniverse Portfolio" <${process.env.SMTP_USER}>`,
            to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
            subject: `New Contact Message from ${message.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                        <h2 style="color: white; margin: 0;">New Contact Message</h2>
                    </div>
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h3 style="color: #333; margin-top: 0;">Message Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #667eea;">Name:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${message.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #667eea;">Email:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${message.email}" style="color: #667eea; text-decoration: none;">${message.email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #667eea;">Subject:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${message.subject}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #667eea;">Date:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(message.createdAt).toLocaleString()}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #667eea; border-radius: 5px;">
                            <h4 style="margin-top: 0; color: #333;">Message:</h4>
                            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message.message}</p>
                        </div>
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/dashboard" 
                               style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                View in Dashboard
                            </a>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>This is an automated notification from your VKuniverse Portfolio.</p>
                    </div>
                </div>
            `,
            text: `
New Contact Message from ${message.name}

Name: ${message.name}
Email: ${message.email}
Subject: ${message.subject}
Date: ${new Date(message.createdAt).toLocaleString()}

Message:
${message.message}

---
View this message in your admin dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/dashboard
            `.trim(),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Notification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending notification email:', error);
        // Don't throw error - we don't want to fail the message creation if email fails
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendNotificationEmail,
};
