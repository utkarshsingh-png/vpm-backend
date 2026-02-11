const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/emailService');
const { generateRegistrationEmail, generateOTPEmail } = require('../utils/emailTemplates');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Generate OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Register Visitor with company name
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, company } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Validate phone number
        if (!phone || phone.length < 10) {
            return res.status(400).json({ error: 'Valid phone number is required' });
        }

        // Create new visitor with company
        const user = new User({
            name,
            email,
            password,
            phone,
            company,
            role: 'visitor'
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        // Send registration confirmation email with beautiful template
        const emailHtml = generateRegistrationEmail(user.name);
        await sendEmail(user.email, '🎉 Registration Successful - Visitor Management System', emailHtml);

        res.status(201).json({
            message: 'Registration successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                phone: user.phone
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login with OTP (Updated with beautiful email template)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP
        await OTP.create({
            email,
            otp,
            purpose: 'login',
            expiresAt
        });

        // Send OTP via email with beautiful template
        const emailHtml = generateOTPEmail(user.name, otp);
        await sendEmail(
            email,
            '🔐 Your Login OTP - Visitor Management System',
            emailHtml
        );

        res.json({
            message: 'OTP sent to your email',
            email,
            requiresOTP: true,
            user: {
                name: user.name,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find valid OTP
        const otpRecord = await OTP.findOne({
            email,
            otp,
            purpose: 'login',
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Find user
        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate token
        const token = generateToken(user);

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                company: user.company,
                department: user.department
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    res.json({
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            phone: req.user.phone,
            company: req.user.company,
            department: req.user.department,
            isActive: req.user.isActive,
            createdAt: req.user.createdAt
        }
    });
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['name', 'phone', 'company'];
        const filteredUpdates = {};

        // Only allow certain fields to be updated
        for (const key in updates) {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user._id,
            filteredUpdates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                company: user.company,
                department: user.department,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Send password change notification
        const emailHtml = `
            <h2>Password Changed Successfully</h2>
            <p>Hello ${user.name},</p>
            <p>Your password has been successfully changed.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `;

        await sendEmail(
            user.email,
            '🔒 Password Changed - Security Alert',
            emailHtml
        );

        res.json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};