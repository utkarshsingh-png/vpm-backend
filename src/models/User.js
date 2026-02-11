const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return this.role === 'visitor' || this.role === 'admin' || this.role === 'security';
        },
        minlength: 6
    },
    role: {
        type: String,
        enum: ['visitor', 'security', 'client', 'admin'],
        default: 'visitor',
        required: true
    },
    phone: {
        type: String,
        required: function() {
            return this.role === 'visitor' || this.role === 'security' || this.role === 'client';
        }
    },
    company: {
        type: String,
        required: function() {
            return this.role === 'visitor';
        }
    },
    department: {
        type: String,
        required: function() {
            return this.role === 'client';
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);