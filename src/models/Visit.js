const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    aadharNumber: {
        type: String,
        required: true,
        match: [/^\d{12}$/, 'Aadhar number must be 12 digits']
    }
}, { _id: false });

const visitSchema = new mongoose.Schema({
    primaryVisitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visitors: [visitorSchema],
    visitDate: {
        type: String,
        required: true // Format: dd-mm-yyyy
    },
    visitTime: {
        type: String,
        required: true // Format: HH:MM
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hostName: {
        type: String,
        required: true
    },
    hostEmail: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled', 'ongoing', 'completed'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    qrCode: {
        type: String, // Will store QR code data URL or path
        default: null
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    checkedInVisitors: [{
        name: String,
        email: String,
        aadharNumber: String,
        checkInTime: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

visitSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Visit', visitSchema);