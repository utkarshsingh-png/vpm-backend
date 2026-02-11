const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['login', 'visit', 'reset-password'],
        default: 'login'
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '5m' } // OTP expires after 5 minutes
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OTP', otpSchema);