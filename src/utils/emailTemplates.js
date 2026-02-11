const generateRegistrationEmail = (visitorName) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .header { color: white; padding: 40px 30px; text-align: center; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 20px; letter-spacing: 2px; }
            .content { background: white; padding: 40px 30px; border-radius: 20px 20px 0 0; margin-top: -20px; box-shadow: 0 -5px 20px rgba(0,0,0,0.1); }
            .greeting { font-size: 24px; color: #2d3748; margin-bottom: 20px; }
            .features { background: #f7fafc; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea; }
            .features li { margin: 10px 0; padding-left: 10px; }
            .footer { text-align: center; padding: 25px; color: #718096; font-size: 14px; background: #f7fafc; border-radius: 0 0 20px 20px; }
            .social-icons { margin-top: 20px; }
            .social-icons a { margin: 0 10px; color: #667eea; text-decoration: none; font-size: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">👋 VMS</div>
                <h1 style="margin: 0; font-weight: 300;">Welcome to Visitor Management</h1>
            </div>
            <div class="content">
                <div class="greeting">Hello ${visitorName},</div>
                <p>Welcome aboard! Your registration with Visitor Management System is complete. We're excited to help you manage your visits efficiently.</p>
                
                <div class="features">
                    <h3 style="margin-top: 0; color: #4a5568;">What you can do now:</h3>
                    <ul style="list-style: none; padding-left: 0;">
                        <li>✅ Schedule visits to organizations</li>
                        <li>✅ Track your visit history</li>
                        <li>✅ Receive digital QR codes</li>
                        <li>✅ Get instant notifications</li>
                        <li>✅ Manage multiple visitors</li>
                    </ul>
                </div>
                
                <p>Start by scheduling your first visit through our platform or mobile app.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; letter-spacing: 1px;">Get Started</a>
                </div>
                
                <p style="color: #4a5568;">Need help? Contact our support team anytime.</p>
                
                <p>Best regards,<br><strong>Visitor Management Team</strong></p>
            </div>
            <div class="footer">
                <p>© 2024 Visitor Management System. All rights reserved.</p>
                <div class="social-icons">
                    <a href="#">📱</a>
                    <a href="#">📧</a>
                    <a href="#">🔗</a>
                    <a href="#">📞</a>
                </div>
                <p style="margin-top: 15px; font-size: 12px;">
                    <a href="#" style="color: #718096; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="#" style="color: #718096; text-decoration: none; margin: 0 10px;">Terms of Service</a> | 
                    <a href="#" style="color: #718096; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateOTPEmail = (userName, otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f7fa; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(102, 126, 234, 0.1); }
            .header { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 40px 30px; text-align: center; color: white; }
            .otp-container { text-align: center; padding: 40px 30px; background: #f7fafc; margin: 20px; border-radius: 15px; border: 2px dashed #c6f6d5; }
            .otp-code { font-size: 48px; font-weight: bold; letter-spacing: 10px; color: #2d3748; background: white; padding: 20px; border-radius: 10px; display: inline-block; margin: 20px 0; font-family: monospace; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
            .timer { font-size: 18px; color: #718096; margin-top: 20px; }
            .timer span { color: #f56565; font-weight: bold; }
            .content { padding: 30px; }
            .security-note { background: #fffaf0; border-left: 4px solid #f6ad55; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .footer { background: #2d3748; color: #a0aec0; padding: 25px; text-align: center; border-radius: 0 0 20px 20px; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .icon { font-size: 48px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">🔐</div>
                <h1 style="margin: 10px 0; font-size: 28px;">Secure Login</h1>
                <p style="margin: 0; opacity: 0.9;">One-Time Password for Authentication</p>
            </div>
            
            <div class="content">
                <h2 style="color: #2d3748; margin-bottom: 10px;">Hello ${userName},</h2>
                <p>You've requested to login to your Visitor Management System account. Use the OTP below to complete your login:</p>
                
                <div class="otp-container">
                    <p style="margin: 0 0 15px 0; color: #4a5568;">Your 6-digit verification code:</p>
                    <div class="otp-code">${otp}</div>
                    <p class="timer">⏰ Expires in: <span>5 minutes</span></p>
                </div>
                
                <div class="security-note">
                    <h4 style="margin-top: 0; color: #d69e2e;">🛡️ Security Notice:</h4>
                    <p style="margin: 5px 0;">• Never share this OTP with anyone</p>
                    <p style="margin: 5px 0;">• Our team will never ask for your OTP</p>
                    <p style="margin: 5px 0;">• If you didn't request this, please ignore this email</p>
                </div>
                
                <p style="color: #718096; font-size: 14px; margin-top: 25px;">
                    For security reasons, this OTP will expire in 5 minutes. If you need a new OTP, please try logging in again.
                </p>
            </div>
            
            <div class="footer">
                <div class="logo">VMS</div>
                <p style="margin: 10px 0;">Visitor Management System</p>
                <p style="font-size: 12px; margin: 15px 0 0 0;">
                    Need help? <a href="mailto:support@vms.com" style="color: #38f9d7; text-decoration: none;">Contact Support</a>
                </p>
                <p style="font-size: 12px; margin-top: 10px;">
                    © 2024 Visitor Management System. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateVisitQRCodeEmail = (visitorName, visitDate, visitTime, hostName, qrCodeDataURL) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f7fa; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(102, 126, 234, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .visit-info { background: #f7fafc; padding: 25px; border-radius: 15px; margin: 25px 0; border: 2px solid #e2e8f0; }
            .info-item { margin: 15px 0; display: flex; align-items: center; }
            .info-item span:first-child { min-width: 100px; color: #4a5568; font-weight: 600; }
            .qr-container { text-align: center; padding: 30px; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 15px; margin: 30px 0; border: 2px dashed #cbd5e0; }
            .qr-code { max-width: 200px; height: auto; margin: 20px auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
            .instructions { background: #fffaf0; border-left: 4px solid #f6ad55; padding: 20px; margin: 25px 0; border-radius: 0 10px 10px 0; }
            .footer { background: #2d3748; color: #a0aec0; padding: 25px; text-align: center; border-radius: 0 0 20px 20px; }
            .icon { font-size: 48px; margin-bottom: 20px; }
            .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin: 10px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">🎫</div>
                <h1 style="margin: 10px 0; font-size: 28px;">Visit Approved!</h1>
                <p style="margin: 0; opacity: 0.9;">Your Digital Access Pass is Ready</p>
            </div>
            
            <div class="content">
                <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${visitorName},</h2>
                <p>Great news! Your visit request has been approved by <strong>${hostName}</strong>. Here are your visit details:</p>
                
                <div class="visit-info">
                    <div class="info-item">
                        <span>📅 Date:</span>
                        <span style="margin-left: 15px; font-weight: 600; color: #2d3748;">${visitDate}</span>
                    </div>
                    <div class="info-item">
                        <span>⏰ Time:</span>
                        <span style="margin-left: 15px; font-weight: 600; color: #2d3748;">${visitTime}</span>
                    </div>
                    <div class="info-item">
                        <span>👤 Host:</span>
                        <span style="margin-left: 15px; font-weight: 600; color: #2d3748;">${hostName}</span>
                    </div>
                </div>
                
                <div class="qr-container">
                    <h3 style="color: #4a5568; margin-bottom: 20px;">🎯 Your Digital QR Code</h3>
                    <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code">
                    <p style="color: #718096; margin-top: 20px;">
                        <strong>Present this QR code at the security desk for check-in</strong>
                    </p>
                </div>
                
                <div class="instructions">
                    <h4 style="color: #d69e2e; margin-top: 0;">📋 Important Instructions:</h4>
                    <p>• Show this QR code to security personnel upon arrival</p>
                    <p>• Keep this email accessible during your visit</p>
                    <p>• QR code is valid only for your scheduled visit time</p>
                    <p>• Arrive 10 minutes before your scheduled time</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" class="btn">Add to Calendar</a>
                    <a href="#" class="btn" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">View Visit Details</a>
                </div>
            </div>
            
            <div class="footer">
                <p style="margin: 10px 0;">Visitor Management System</p>
                <p style="font-size: 12px; margin: 15px 0 0 0;">
                    Having trouble? <a href="mailto:support@vms.com" style="color: #667eea; text-decoration: none;">Contact Support</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateVisitRejectedEmail = (visitorName, visitDate, visitTime, hostName, reason) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #fef2f2; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(245, 101, 101, 0.1); }
            .header { background: linear-gradient(135deg, #fc8181 0%, #f56565 100%); padding: 40px 30px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .visit-info { background: #fef2f2; padding: 25px; border-radius: 15px; margin: 25px 0; border: 2px solid #fed7d7; }
            .reason-box { background: #fffaf0; border-left: 4px solid #f6ad55; padding: 20px; margin: 25px 0; border-radius: 0 10px 10px 0; }
            .action-box { background: #f0fff4; padding: 25px; border-radius: 15px; margin: 30px 0; border: 2px solid #c6f6d5; }
            .footer { background: #2d3748; color: #a0aec0; padding: 25px; text-align: center; border-radius: 0 0 20px 20px; }
            .icon { font-size: 48px; margin-bottom: 20px; }
            .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin: 10px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">⚠️</div>
                <h1 style="margin: 10px 0; font-size: 28px;">Visit Request Rejected</h1>
                <p style="margin: 0; opacity: 0.9;">We regret to inform you</p>
            </div>
            
            <div class="content">
                <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${visitorName},</h2>
                <p>We regret to inform you that your visit request has been rejected by <strong>${hostName}</strong>.</p>
                
                <div class="visit-info">
                    <h4 style="color: #c53030; margin-top: 0;">📅 Visit Details:</h4>
                    <p><strong>Date:</strong> ${visitDate}</p>
                    <p><strong>Time:</strong> ${visitTime}</p>
                    <p><strong>Host:</strong> ${hostName}</p>
                </div>
                
                <div class="reason-box">
                    <h4 style="color: #d69e2e; margin-top: 0;">📝 Reason for Rejection:</h4>
                    <p>${reason}</p>
                </div>
                
                <div class="action-box">
                    <h4 style="color: #38a169; margin-top: 0;">🚀 What You Can Do Next:</h4>
                    <p>• Schedule a new visit with adjusted timing</p>
                    <p>• Contact the host directly for clarification</p>
                    <p>• Try a different date or time slot</p>
                    <p>• Reach out to our support team for assistance</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" class="btn">Schedule New Visit</a>
                    <a href="#" class="btn" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">Contact Support</a>
                </div>
                
                <p style="color: #718096; margin-top: 30px; text-align: center;">
                    We apologize for any inconvenience caused. We hope to serve you better next time.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 10px 0;">Visitor Management System</p>
                <p style="font-size: 12px; margin: 15px 0 0 0;">
                    Need assistance? <a href="mailto:support@vms.com" style="color: #667eea; text-decoration: none;">We're here to help</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateVisitCancelledEmail = (recipientName, visitDate, visitTime, otherPartyName, reason) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #fff7ed; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(237, 137, 54, 0.1); }
            .header { background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); padding: 40px 30px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .visit-info { background: #fffaf0; padding: 25px; border-radius: 15px; margin: 25px 0; border: 2px solid #feebc8; }
            .reason-box { background: #fef2f2; border-left: 4px solid #fc8181; padding: 20px; margin: 25px 0; border-radius: 0 10px 10px 0; }
            .next-steps { background: #f0fff4; padding: 25px; border-radius: 15px; margin: 30px 0; border: 2px solid #c6f6d5; }
            .footer { background: #2d3748; color: #a0aec0; padding: 25px; text-align: center; border-radius: 0 0 20px 20px; }
            .icon { font-size: 48px; margin-bottom: 20px; }
            .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin: 10px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">🔄</div>
                <h1 style="margin: 10px 0; font-size: 28px;">Visit Cancelled</h1>
                <p style="margin: 0; opacity: 0.9;">Schedule Update Notification</p>
            </div>
            
            <div class="content">
                <h2 style="color: #2d3748; margin-bottom: 20px;">Hello ${recipientName},</h2>
                <p>This is to inform you that a scheduled visit has been cancelled.</p>
                
                <div class="visit-info">
                    <h4 style="color: #dd6b20; margin-top: 0;">📅 Cancelled Visit Details:</h4>
                    <p><strong>Date:</strong> ${visitDate}</p>
                    <p><strong>Time:</strong> ${visitTime}</p>
                    <p><strong>Related Party:</strong> ${otherPartyName}</p>
                </div>
                
                <div class="reason-box">
                    <h4 style="color: #c53030; margin-top: 0;">📝 Reason for Cancellation:</h4>
                    <p>${reason}</p>
                </div>
                
                <div class="next-steps">
                    <h4 style="color: #38a169; margin-top: 0;">📋 Next Steps:</h4>
                    <p>• This visit has been removed from your schedule</p>
                    <p>• You can schedule a new visit if needed</p>
                    <p>• Contact us for any questions</p>
                    <p>• Check your calendar for other appointments</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" class="btn">View Your Schedule</a>
                    <a href="#" class="btn" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">Schedule New Visit</a>
                </div>
                
                <p style="color: #718096; margin-top: 30px; text-align: center;">
                    We apologize for any inconvenience this may have caused.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 10px 0;">Visitor Management System</p>
                <p style="font-size: 12px; margin: 15px 0 0 0;">
                    Questions? <a href="mailto:support@vms.com" style="color: #667eea; text-decoration: none;">Contact Us</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateCheckInEmail = (recipientName, otherPartyName, checkInTime) => {
    const formattedTime = new Date(checkInTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f0fff4; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(72, 187, 120, 0.1); }
            .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 30px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .success-card { background: #f0fff4; padding: 30px; border-radius: 15px; margin: 25px 0; border: 2px solid #c6f6d5; text-align: center; }
            .details-box { background: #f7fafc; padding: 25px; border-radius: 15px; margin: 25px 0; border: 2px solid #e2e8f0; }
            .reminders { background: #fffaf0; border-left: 4px solid #f6ad55; padding: 20px; margin: 25px 0; border-radius: 0 10px 10px 0; }
            .footer { background: #2d3748; color: #a0aec0; padding: 25px; text-align: center; border-radius: 0 0 20px 20px; }
            .icon { font-size: 48px; margin-bottom: 20px; }
            .check-icon { font-size: 64px; color: #48bb78; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">✅</div>
                <h1 style="margin: 10px 0; font-size: 28px;">Check-in Successful!</h1>
                <p style="margin: 0; opacity: 0.9;">Welcome to the premises</p>
            </div>
            
            <div class="content">
                <div class="success-card">
                    <div class="check-icon">✓</div>
                    <h2 style="color: #38a169; margin: 10px 0;">Check-in Confirmed!</h2>
                    <p style="color: #4a5568;">Hello ${recipientName}, you have successfully checked in.</p>
                </div>
                
                <div class="details-box">
                    <h4 style="color: #2d3748; margin-top: 0;">📋 Visit Details:</h4>
                    <p><strong>👥 Meeting With:</strong> ${otherPartyName}</p>
                    <p><strong>⏰ Check-in Time:</strong> ${formattedTime}</p>
                    <p><strong>🎯 Current Status:</strong> <span style="color: #38a169; font-weight: bold;">On Premises</span></p>
                </div>
                
                <div class="reminders">
                    <h4 style="color: #d69e2e; margin-top: 0;">📌 Important Reminders:</h4>
                    <p>• Please wear your visitor badge at all times</p>
                    <p>• Follow all security protocols during your visit</p>
                    <p>• Check-out is required when leaving</p>
                    <p>• Contact security for any assistance needed</p>
                </div>
                
                <p style="color: #718096; text-align: center; margin-top: 30px;">
                    You will receive another notification when you check out.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 10px 0;">Visitor Management System</p>
                <p style="font-size: 12px; margin: 15px 0 0 0;">
                    Need assistance? <a href="#" style="color: #48bb78; text-decoration: none;">Contact Security</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateCheckOutEmail = (recipientName, otherPartyName, checkInTime, checkOutTime) => {
    const formattedCheckIn = new Date(checkInTime).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const formattedCheckOut = new Date(checkOutTime).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const duration = Math.round((new Date(checkOutTime) - new Date(checkInTime)) / (1000 * 60));
    const durationHours = Math.floor(duration / 60);
    const durationMinutes = duration % 60;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #ebf8ff; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(66, 153, 225, 0.1); }
            .header { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); padding: 40px 30px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .completion-card { background: #ebf8ff; padding: 30px; border-radius: 15px; margin: 25px 0; border: 2px solid #bee3f8; text-align: center; }
            .summary-box { background: #f7fafc; padding: 25px; border-radius: 15px; margin: 25px 0; border: 2px solid #e2e8f0; }
            .summary-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .summary-item:last-child { border-bottom: none; }
            .feedback-box { background: #fffaf0; padding: 25px; border-radius: 15px; margin: 25px 0; border: 2px solid #feebc8; }
            .footer { background: #2d3748; color: #a0aec0; padding: 25px; text-align: center; border-radius: 0 0 20px 20px; }
            .icon { font-size: 48px; margin-bottom: 20px; }
            .complete-icon { font-size: 64px; color: #4299e1; margin: 20px 0; }
            .btn { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin: 10px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">🏁</div>
                <h1 style="margin: 10px 0; font-size: 28px;">Visit Completed!</h1>
                <p style="margin: 0; opacity: 0.9;">Check-out Successful</p>
            </div>
            
            <div class="content">
                <div class="completion-card">
                    <div class="complete-icon">✓</div>
                    <h2 style="color: #3182ce; margin: 10px 0;">Thank You for Visiting!</h2>
                    <p style="color: #4a5568;">Hello ${recipientName}, your visit has been successfully completed.</p>
                </div>
                
                <div class="summary-box">
                    <h4 style="color: #2d3748; margin-top: 0;">📊 Visit Summary:</h4>
                    <div class="summary-item">
                        <span>👥 Met With:</span>
                        <span style="font-weight: 600;">${otherPartyName}</span>
                    </div>
                    <div class="summary-item">
                        <span>⏰ Check-in:</span>
                        <span>${formattedCheckIn}</span>
                    </div>
                    <div class="summary-item">
                        <span>⏰ Check-out:</span>
                        <span>${formattedCheckOut}</span>
                    </div>
                    <div class="summary-item">
                        <span>⏱️ Duration:</span>
                        <span style="font-weight: 600; color: #3182ce;">
                            ${durationHours > 0 ? `${durationHours}h ` : ''}${durationMinutes}m
                        </span>
                    </div>
                </div>
                
                <div class="feedback-box">
                    <h4 style="color: #d69e2e; margin-top: 0;">💬 We Value Your Feedback</h4>
                    <p>How was your visit experience? Your feedback helps us improve our services.</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="#" class="btn">Share Feedback</a>
                    </div>
                </div>
                
                <p style="color: #718096; text-align: center; margin-top: 30px;">
                    We hope to see you again soon! Safe travels.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 10px 0;">Visitor Management System</p>
                <p style="font-size: 12px; margin: 15px 0 0 0;">
                    Schedule another visit? <a href="#" style="color: #4299e1; text-decoration: none;">Click here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    generateRegistrationEmail,
    generateOTPEmail,
    generateVisitQRCodeEmail,
    generateVisitRejectedEmail,
    generateVisitCancelledEmail,
    generateCheckInEmail,
    generateCheckOutEmail
};