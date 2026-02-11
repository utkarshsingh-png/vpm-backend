const Visit = require('../models/Visit');
const User = require('../models/User');
const QRCode = require('qrcode');
const { sendEmail } = require('../utils/emailService');
const { 
    generateVisitQRCodeEmail, 
    generateVisitRejectedEmail, 
    generateVisitCancelledEmail, 
    generateCheckInEmail, 
    generateCheckOutEmail 
} = require('../utils/emailTemplates');

// Create visit request with multiple visitors
exports.createVisit = async (req, res) => {
    try {
        const {
            visitors,
            visitDate,
            visitTime,
            hostId,
            purpose,
            deviceName
        } = req.body;

        // Validate visitors count
        if (!visitors || visitors.length === 0 || visitors.length > 4) {
            return res.status(400).json({ error: 'Number of visitors must be between 1 and 4' });
        }

        // Validate Aadhar numbers
        for (const visitor of visitors) {
            if (!visitor.aadharNumber || !/^\d{12}$/.test(visitor.aadharNumber)) {
                return res.status(400).json({ error: 'Each visitor must have a valid 12-digit Aadhar number' });
            }
        }

        // Check if host exists and is a client
        const host = await User.findOne({ _id: hostId, role: 'host', isActive: true });
        if (!host) {
            return res.status(404).json({ error: 'Host not found or not a client' });
        }

        // Create visit request
        const visit = new Visit({
            primaryVisitor: req.user._id,
            visitors,
            visitDate,
            visitTime,
            host: hostId,
            hostName: host.name,
            hostEmail: host.email,
            purpose,
            deviceName,
            status: 'pending'
        });

        await visit.save();

        // Notify host about visit request
        const emailSubject = `👥 New Visit Request - ${visitors.length} visitor(s)`;
        const emailContent = `
            <h2>New Visit Request</h2>
            <p>You have a new visit request for ${visitDate} at ${visitTime}.</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Number of Visitors:</strong> ${visitors.length}</p>
            <p><strong>Primary Visitor:</strong> ${visitors[0].name}</p>
            <p>Please log in to the portal to approve or reject this request.</p>
        `;
        
        await sendEmail(
            host.email,
            emailSubject,
            emailContent
        );

        res.status(201).json({
            message: 'Visit request created successfully',
            visit: {
                _id: visit._id,
                visitors: visit.visitors,
                visitDate,
                visitTime,
                hostName: host.name,
                purpose,
                status: visit.status
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all visits for visitor
exports.getMyVisits = async (req, res) => {
    try {
        const visits = await Visit.find({ primaryVisitor: req.user._id })
            .sort({ createdAt: -1 })
            .populate('host', 'name email department');

        res.json({ visits });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get pending visits for host (client)
exports.getPendingVisitsForHost = async (req, res) => {
    try {
        const visits = await Visit.find({
            host: req.user._id,
            status: 'pending'
        })
        .sort({ visitDate: 1, visitTime: 1 })
        .populate('primaryVisitor', 'name email phone company');

        res.json({ visits });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllVisitsForHost = async (req, res) => {
    try {
        const { status, date, sortBy = 'visitDate', order = 'desc' } = req.query;
        
        // Build filter object
        const filter = { host: req.user._id };
        
        // Add status filter if provided
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        // Add date filter if provided
        if (date) {
            filter.visitDate = date; // Assuming date format: dd-mm-yyyy
        }
        
        // Sorting options
        const sortOptions = {};
        if (sortBy === 'visitDate') {
            sortOptions.visitDate = order === 'asc' ? 1 : -1;
            sortOptions.visitTime = order === 'asc' ? 1 : -1;
        } else if (sortBy === 'createdAt') {
            sortOptions.createdAt = order === 'asc' ? 1 : -1;
        } else if (sortBy === 'status') {
            sortOptions.status = order === 'asc' ? 1 : -1;
        }
        
        const visits = await Visit.find(filter)
            .sort(sortOptions)
            .populate('primaryVisitor', 'name email phone company')
            .populate('host', 'name email department phone');

        // Format response with stats
        const stats = {
            total: visits.length,
            pending: visits.filter(v => v.status === 'pending').length,
            approved: visits.filter(v => v.status === 'approved').length,
            rejected: visits.filter(v => v.status === 'rejected').length,
            cancelled: visits.filter(v => v.status === 'cancelled').length,
            ongoing: visits.filter(v => v.status === 'ongoing').length,
            completed: visits.filter(v => v.status === 'completed').length
        };

        res.json({ 
            success: true,
            visits,
            stats,
            count: visits.length
        });
    } catch (error) {
        console.error('Error fetching host visits:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch visits',
            message: error.message 
        });
    }
};

// Update visit details (only visit time and device name) - by host
exports.updateVisitDetails = async (req, res) => {
    try {
        const { visitId } = req.params;
        const { visitTime, deviceName } = req.body;

        // Validate required fields
        if (!visitTime) {
            return res.status(400).json({ 
                success: false,
                error: 'Visit time is required' 
            });
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(visitTime)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid time format. Please use HH:MM format' 
            });
        }

        // Find the visit
        const visit = await Visit.findOne({
            _id: visitId,
            host: req.user._id
        }).populate('primaryVisitor', 'email name');

        if (!visit) {
            return res.status(404).json({ 
                success: false,
                error: 'Visit not found or you are not authorized to update it' 
            });
        }

        // Check if visit can be updated (only pending or approved visits can be updated)
        if (!['pending', 'approved'].includes(visit.status)) {
            return res.status(400).json({ 
                success: false,
                error: 'Visit cannot be updated. Only pending or approved visits can be modified' 
            });
        }

        // Store old values for email notification
        const oldVisitTime = visit.visitTime;
        const oldDeviceName = visit.deviceName;

        // Update visit details
        visit.visitTime = visitTime;
        visit.deviceName = deviceName || ''; // If deviceName is not provided, set to empty string
        await visit.save();

        // Get primary visitor
        const primaryVisitor = await User.findById(visit.primaryVisitor);

        // Send notification email to primary visitor
        let changes = [];
        
        if (oldVisitTime !== visitTime) {
            changes.push(`Visit time changed from ${oldVisitTime} to ${visitTime}`);
        }
        
        if (oldDeviceName !== visit.deviceName) {
            if (oldDeviceName && !visit.deviceName) {
                changes.push('Device information removed');
            } else if (!oldDeviceName && visit.deviceName) {
                changes.push(`Device added: ${visit.deviceName}`);
            } else {
                changes.push(`Device changed from "${oldDeviceName}" to "${visit.deviceName}"`);
            }
        }

        if (changes.length > 0) {
            // Send update email to primary visitor
            const updateEmailHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Visit Details Updated</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .email-header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .email-header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: 600;
                        }
                        .email-body {
                            padding: 30px;
                        }
                        .update-card {
                            background-color: #f8f9fa;
                            border-left: 4px solid #667eea;
                            padding: 20px;
                            margin: 20px 0;
                            border-radius: 5px;
                        }
                        .update-card h3 {
                            margin-top: 0;
                            color: #667eea;
                        }
                        .changes-list {
                            margin: 0;
                            padding-left: 20px;
                        }
                        .changes-list li {
                            margin-bottom: 8px;
                        }
                        .visit-details {
                            background-color: #f0f7ff;
                            border: 1px solid #d1e7ff;
                            border-radius: 8px;
                            padding: 20px;
                            margin: 20px 0;
                        }
                        .detail-row {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 10px;
                            padding-bottom: 10px;
                            border-bottom: 1px solid #e9ecef;
                        }
                        .detail-row:last-child {
                            border-bottom: none;
                        }
                        .detail-label {
                            font-weight: 600;
                            color: #495057;
                        }
                        .detail-value {
                            color: #212529;
                        }
                        .cta-button {
                            display: inline-block;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            text-decoration: none;
                            padding: 12px 30px;
                            border-radius: 25px;
                            font-weight: 600;
                            margin: 20px 0;
                        }
                        .email-footer {
                            text-align: center;
                            padding: 20px;
                            background-color: #f8f9fa;
                            color: #6c757d;
                            font-size: 14px;
                            border-top: 1px solid #e9ecef;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="email-header">
                            <h1>📅 Visit Details Updated</h1>
                        </div>
                        
                        <div class="email-body">
                            <p>Hello <strong>${primaryVisitor.name}</strong>,</p>
                            
                            <p>The host <strong>${visit.hostName}</strong> has updated your visit details:</p>
                            
                            <div class="update-card">
                                <h3>📝 Changes Made:</h3>
                                <ul class="changes-list">
                                    ${changes.map(change => `<li>${change}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="visit-details">
                                <h3 style="color: #667eea; margin-top: 0;">Current Visit Details:</h3>
                                <div class="detail-row">
                                    <span class="detail-label">📅 Visit Date:</span>
                                    <span class="detail-value">${visit.visitDate}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">⏰ Visit Time:</span>
                                    <span class="detail-value">${visit.visitTime}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">👤 Host:</span>
                                    <span class="detail-value">${visit.hostName}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">🎯 Purpose:</span>
                                    <span class="detail-value">${visit.purpose}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">💻 Device:</span>
                                    <span class="detail-value">${visit.deviceName || 'Not specified'}</span>
                                </div>
                            </div>
                            
                            <p>Please make a note of these changes and plan accordingly.</p>
                            
                            <p>If you have any questions, please contact the host directly.</p>
                            
                            <div style="text-align: center;">
                                <a href="#" class="cta-button">View Visit Details</a>
                            </div>
                        </div>
                        
                        <div class="email-footer">
                            <p>This is an automated notification from the Visitor Management System.</p>
                            <p>Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            await sendEmail(
                primaryVisitor.email,
                '🔄 Visit Details Updated - Notification',
                updateEmailHtml
            );

            // Send notification to other visitors in the group
            for (const visitor of visit.visitors) {
                if (visitor.email !== primaryVisitor.email) {
                    const groupUpdateEmailHtml = `
                        <h2>Visit Details Updated</h2>
                        <p>Hello ${visitor.name},</p>
                        <p>The host <strong>${visit.hostName}</strong> has updated the visit details:</p>
                        <ul>
                            ${changes.map(change => `<li>${change}</li>`).join('')}
                        </ul>
                        <p><strong>Updated Visit Details:</strong></p>
                        <ul>
                            <li>Date: ${visit.visitDate}</li>
                            <li>Time: ${visit.visitTime}</li>
                            <li>Host: ${visit.hostName}</li>
                            <li>Device: ${visit.deviceName || 'Not specified'}</li>
                        </ul>
                        <p>Please plan accordingly for your visit.</p>
                    `;
                    
                    await sendEmail(
                        visitor.email,
                        '🔄 Visit Details Updated - Group Notification',
                        groupUpdateEmailHtml
                    );
                }
            }

            // Send notification to admin
            const admin = await User.findOne({ role: 'admin', isActive: true });
            if (admin) {
                const adminEmailHtml = `
                    <h2>Visit Details Updated by Host</h2>
                    <p>Visit ${visit._id} details have been updated by host ${visit.hostName}.</p>
                    <p><strong>Changes Made:</strong></p>
                    <ul>
                        ${changes.map(change => `<li>${change}</li>`).join('')}
                    </ul>
                    <p><strong>Visit Details:</strong></p>
                    <ul>
                        <li>Date: ${visit.visitDate}</li>
                        <li>Time: ${visit.visitTime}</li>
                        <li>Primary Visitor: ${primaryVisitor.name}</li>
                        <li>Device: ${visit.deviceName || 'Not specified'}</li>
                        <li>Status: ${visit.status}</li>
                    </ul>
                `;
                
                await sendEmail(
                    admin.email,
                    '📊 Visit Details Updated - Admin Notification',
                    adminEmailHtml
                );
            }
        }

        res.json({
            success: true,
            message: 'Visit details updated successfully',
            visit: {
                _id: visit._id,
                visitDate: visit.visitDate,
                visitTime: visit.visitTime,
                deviceName: visit.deviceName,
                status: visit.status,
                changes: changes.length > 0 ? changes : ['No changes were made']
            }
        });

    } catch (error) {
        console.error('Error updating visit details:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update visit details',
            message: error.message 
        });
    }
};

// Approve visit request (by host/client)
exports.approveVisit = async (req, res) => {
    try {
        const { visitId } = req.params;

        const visit = await Visit.findOne({
            _id: visitId,
            host: req.user._id,
            status: 'pending'
        }).populate('primaryVisitor', 'email name');

        if (!visit) {
            return res.status(404).json({ error: 'Visit request not found' });
        }

        // Generate QR code data
        const qrData = JSON.stringify({
            visitId: visit._id,
            primaryVisitor: visit.primaryVisitor._id,
            host: visit.host,
            timestamp: Date.now()
        });

        // Generate QR code image
        const qrCodeDataURL = await QRCode.toDataURL(qrData);

        // Update visit with QR code
        visit.qrCode = qrCodeDataURL;
        visit.status = 'approved';
        await visit.save();

        // Get primary visitor
        const primaryVisitor = await User.findById(visit.primaryVisitor);

        // Send QR code email to primary visitor with beautiful template
        const emailHtml = generateVisitQRCodeEmail(
            primaryVisitor.name,
            visit.visitDate,
            visit.visitTime,
            visit.hostName,
            qrCodeDataURL
        );

        await sendEmail(
            primaryVisitor.email,
            '🎫 Visit Approved - Your QR Code is Ready!',
            emailHtml
        );

        // Also send notification to all visitors in the group
        for (const visitor of visit.visitors) {
            if (visitor.email !== primaryVisitor.email) {
                const groupEmailHtml = `
                    <h2>Visit Approved!</h2>
                    <p>Hello ${visitor.name},</p>
                    <p>The visit scheduled for ${visit.visitDate} at ${visit.visitTime} has been approved by ${visit.hostName}.</p>
                    <p><strong>Primary Visitor:</strong> ${primaryVisitor.name} will have the QR code for check-in.</p>
                    <p>Please arrive on time with your Aadhar card for verification.</p>
                `;
                
                await sendEmail(
                    visitor.email,
                    '✅ Visit Approved - Group Notification',
                    groupEmailHtml
                );
            }
        }

        res.json({
            message: 'Visit approved successfully',
            visit: {
                _id: visit._id,
                status: visit.status,
                visitDate: visit.visitDate,
                visitTime: visit.visitTime,
                visitors: visit.visitors.map(v => v.name)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reject visit request (by host/client)
exports.rejectVisit = async (req, res) => {
    try {
        const { visitId } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ error: 'Rejection reason is required' });
        }

        const visit = await Visit.findOne({
            _id: visitId,
            host: req.user._id,
            status: 'pending'
        }).populate('primaryVisitor', 'email name');

        if (!visit) {
            return res.status(404).json({ error: 'Visit request not found' });
        }

        visit.status = 'rejected';
        visit.rejectionReason = reason;
        await visit.save();

        // Get primary visitor
        const primaryVisitor = await User.findById(visit.primaryVisitor);

        // Send rejection email to primary visitor with beautiful template
        const visitorEmailHtml = generateVisitRejectedEmail(
            primaryVisitor.name,
            visit.visitDate,
            visit.visitTime,
            visit.hostName,
            reason
        );

        await sendEmail(
            primaryVisitor.email,
            '⚠️ Visit Request Rejected',
            visitorEmailHtml
        );

        // Notify all visitors in the group
        for (const visitor of visit.visitors) {
            if (visitor.email !== primaryVisitor.email) {
                const groupEmailHtml = `
                    <h2>Visit Request Rejected</h2>
                    <p>Hello ${visitor.name},</p>
                    <p>The visit scheduled for ${visit.visitDate} at ${visit.visitTime} has been rejected by ${visit.hostName}.</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                `;
                
                await sendEmail(
                    visitor.email,
                    '❌ Visit Request Rejected - Group Notification',
                    groupEmailHtml
                );
            }
        }

        // Notify admin (if admin exists)
        const admin = await User.findOne({ role: 'admin', isActive: true });
        if (admin) {
            const adminEmailHtml = `
                <h2>Visit Request Rejected</h2>
                <p>Visit request ${visit._id} has been rejected by host ${visit.hostName}.</p>
                <p><strong>Details:</strong></p>
                <ul>
                    <li>Date: ${visit.visitDate}</li>
                    <li>Time: ${visit.visitTime}</li>
                    <li>Primary Visitor: ${primaryVisitor.name}</li>
                    <li>Number of Visitors: ${visit.visitors.length}</li>
                    <li>Reason: ${reason}</li>
                </ul>
            `;
            
            await sendEmail(
                admin.email,
                '📊 Visit Rejected - Admin Notification',
                adminEmailHtml
            );
        }

        res.json({
            message: 'Visit rejected successfully',
            visit: {
                _id: visit._id,
                status: visit.status,
                rejectionReason: reason
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Check-in visitor with QR code (by security)
exports.checkIn = async (req, res) => {
    try {
        const { qrCodeData } = req.body;

        // Parse QR code data
        const qrData = JSON.parse(qrCodeData);
        const { visitId } = qrData;

        const visit = await Visit.findById(visitId);

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        if (visit.status !== 'approved') {
            return res.status(400).json({ error: 'Visit is not approved for check-in' });
        }

        if (visit.status === 'ongoing') {
            return res.status(400).json({ error: 'Visit is already ongoing' });
        }

        // Mark all visitors as checked in
        const checkInTime = new Date();
        const checkedInVisitors = visit.visitors.map(visitor => ({
            name: visitor.name,
            email: visitor.email,
            aadharNumber: visitor.aadharNumber,
            checkInTime: checkInTime
        }));

        visit.status = 'ongoing';
        visit.checkInTime = checkInTime;
        visit.checkedInVisitors = checkedInVisitors;
        await visit.save();

        // Send check-in email to all visitors with beautiful template
        for (const visitor of visit.visitors) {
            const emailHtml = generateCheckInEmail(
                visitor.name,
                visit.hostName,
                visit.checkInTime
            );
            
            await sendEmail(
                visitor.email,
                '✅ Check-in Successful - Welcome!',
                emailHtml
            );
        }

        // Send check-in email to host with beautiful template
        const hostEmailHtml = generateCheckInEmail(
            visit.hostName,
            visit.visitors[0].name,
            visit.checkInTime
        );

        await sendEmail(
            visit.hostEmail,
            '👥 Visitor Checked In - Notification',
            hostEmailHtml
        );

        res.json({
            message: 'Check-in successful',
            visit: {
                visitors: visit.visitors.map(v => ({
                    name: v.name,
                    aadharNumber: v.aadharNumber
                })),
                hostName: visit.hostName,
                checkInTime: visit.checkInTime,
                status: visit.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Check-out visitor (by security)
exports.checkOut = async (req, res) => {
    try {
        const { visitId } = req.params;

        const visit = await Visit.findOne({
            _id: visitId,
            status: 'ongoing'
        });

        if (!visit) {
            return res.status(404).json({ error: 'No ongoing visit found with this ID' });
        }

        const checkOutTime = new Date();
        visit.status = 'completed';
        visit.checkOutTime = checkOutTime;
        await visit.save();

        // Send check-out email to all visitors with beautiful template
        for (const visitor of visit.visitors) {
            const emailHtml = generateCheckOutEmail(
                visitor.name,
                visit.hostName,
                visit.checkInTime,
                visit.checkOutTime
            );
            
            await sendEmail(
                visitor.email,
                '🏁 Visit Completed - Thank You!',
                emailHtml
            );
        }

        // Send check-out email to host with beautiful template
        const hostEmailHtml = generateCheckOutEmail(
            visit.hostName,
            visit.visitors[0].name,
            visit.checkInTime,
            visit.checkOutTime
        );

        await sendEmail(
            visit.hostEmail,
            '👥 Visitor Checked Out - Summary',
            hostEmailHtml
        );

        res.json({
            message: 'Check-out successful',
            visit: {
                visitors: visit.visitors.map(v => v.name),
                hostName: visit.hostName,
                checkInTime: visit.checkInTime,
                checkOutTime: visit.checkOutTime,
                duration: Math.round((checkOutTime - visit.checkInTime) / (1000 * 60)), // in minutes
                status: visit.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get ongoing visits (for security)
exports.getOngoingVisits = async (req, res) => {
    try {
        const visits = await Visit.find({ status: 'ongoing' })
            .sort({ checkInTime: 1 })
            .select('visitors hostName checkInTime checkedInVisitors');

        res.json({ visits });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel visit (by visitor)
exports.cancelVisit = async (req, res) => {
    try {
        const { visitId } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ error: 'Cancellation reason is required' });
        }

        const visit = await Visit.findOne({
            _id: visitId,
            primaryVisitor: req.user._id,
            status: { $in: ['pending', 'approved'] }
        }).populate('primaryVisitor', 'email name');

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found or cannot be cancelled' });
        }

        visit.status = 'cancelled';
        visit.rejectionReason = reason;
        await visit.save();

        // Get primary visitor
        const primaryVisitor = await User.findById(visit.primaryVisitor);

        // Send cancellation email to primary visitor with beautiful template
        const visitorEmailHtml = generateVisitCancelledEmail(
            primaryVisitor.name,
            visit.visitDate,
            visit.visitTime,
            visit.hostName,
            reason
        );

        await sendEmail(
            primaryVisitor.email,
            '🔄 Visit Cancelled - Confirmation',
            visitorEmailHtml
        );

        // Notify all other visitors in the group
        for (const visitor of visit.visitors) {
            if (visitor.email !== primaryVisitor.email) {
                const groupEmailHtml = `
                    <h2>Visit Cancelled</h2>
                    <p>Hello ${visitor.name},</p>
                    <p>The visit scheduled for ${visit.visitDate} at ${visit.visitTime} has been cancelled.</p>
                    <p><strong>Primary Visitor:</strong> ${primaryVisitor.name}</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                `;
                
                await sendEmail(
                    visitor.email,
                    '🔄 Visit Cancelled - Group Notification',
                    groupEmailHtml
                );
            }
        }

        // Send cancellation email to host with beautiful template
        const hostEmailHtml = generateVisitCancelledEmail(
            visit.hostName,
            visit.visitDate,
            visit.visitTime,
            primaryVisitor.name,
            `Visit cancelled by visitor. Reason: ${reason}`
        );

        await sendEmail(
            visit.hostEmail,
            '🔄 Visit Cancelled - Notification',
            hostEmailHtml
        );

        // Notify admin
        const admin = await User.findOne({ role: 'admin', isActive: true });
        if (admin) {
            const adminEmailHtml = `
                <h2>Visit Cancelled</h2>
                <p>Visit ${visit._id} has been cancelled by ${primaryVisitor.name}.</p>
                <p><strong>Details:</strong></p>
                <ul>
                    <li>Date: ${visit.visitDate}</li>
                    <li>Time: ${visit.visitTime}</li>
                    <li>Primary Visitor: ${primaryVisitor.name}</li>
                    <li>Number of Visitors: ${visit.visitors.length}</li>
                    <li>Reason: ${reason}</li>
                </ul>
            `;
            
            await sendEmail(
                admin.email,
                '📊 Visit Cancelled - Admin Notification',
                adminEmailHtml
            );
        }

        res.json({
            message: 'Visit cancelled successfully',
            visit: {
                _id: visit._id,
                status: visit.status,
                rejectionReason: reason
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get visit by QR code (for security check-in)
exports.getVisitByQRCode = async (req, res) => {
    try {
        const { qrCodeData } = req.body;

        const qrData = JSON.parse(qrCodeData);
        const { visitId } = qrData;

        const visit = await Visit.findById(visitId)
            .populate('primaryVisitor', 'name email phone company')
            .populate('host', 'name email department');

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        res.json({
            visit: {
                _id: visit._id,
                visitors: visit.visitors,
                visitDate: visit.visitDate,
                visitTime: visit.visitTime,
                hostName: visit.hostName,
                hostDepartment: visit.host ? visit.host.department : '',
                purpose: visit.purpose,
                deviceName: visit.deviceName,
                status: visit.status,
                checkInTime: visit.checkInTime,
                checkedInVisitors: visit.checkedInVisitors,
                qrCode: visit.qrCode
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get visit details by ID
exports.getVisitById = async (req, res) => {
    try {
        const { visitId } = req.params;

        const visit = await Visit.findById(visitId)
            .populate('primaryVisitor', 'name email phone company')
            .populate('host', 'name email department');

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        // Check authorization based on role
        const user = req.user;
        let isAuthorized = false;

        if (user.role === 'admin') {
            isAuthorized = true;
        } else if (user.role === 'security') {
            isAuthorized = true;
        } else if (user.role === 'client' && visit.host && visit.host._id.toString() === user._id.toString()) {
            isAuthorized = true;
        } else if (user.role === 'visitor' && visit.primaryVisitor && visit.primaryVisitor._id.toString() === user._id.toString()) {
            isAuthorized = true;
        }

        if (!isAuthorized) {
            return res.status(403).json({ error: 'Not authorized to view this visit' });
        }

        res.json({
            visit: {
                _id: visit._id,
                visitors: visit.visitors,
                visitDate: visit.visitDate,
                visitTime: visit.visitTime,
                hostName: visit.hostName,
                hostEmail: visit.hostEmail,
                purpose: visit.purpose,
                deviceName: visit.deviceName,
                status: visit.status,
                rejectionReason: visit.rejectionReason,
                checkInTime: visit.checkInTime,
                checkOutTime: visit.checkOutTime,
                checkedInVisitors: visit.checkedInVisitors,
                qrCode: visit.qrCode,
                createdAt: visit.createdAt,
                updatedAt: visit.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};