const User = require('../models/User');
const Visit = require('../models/Visit');
const { sendEmail } = require('../utils/emailService');
const { generateRegistrationEmail, generateOTPEmail } = require('../utils/emailTemplates');
// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all visits
exports.getAllVisits = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        
        let filter = {};
        
        if (status) {
            filter.status = status;
        }
        
        if (startDate && endDate) {
            filter.visitDate = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const visits = await Visit.find(filter)
            .populate('visitor', 'name email phone')
            .populate('host', 'name email')
            .sort({ createdAt: -1 });

        res.json({ visits });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new user (by admin)

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, company, department } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const userData = {
            name,
            email,
            password,
            role,
            phone
        };

        if (role === 'client') {
            userData.department = department;
        }
        
        if (role === 'visitor') {
            userData.company = company;
        }

        const user = new User(userData);
        await user.save();

        // Send welcome email based on role
        let emailSubject = '';
        let emailContent = '';
        
        switch(role) {
            case 'security':
                emailSubject = '🔐 Welcome Security Staff - Account Created';
                emailContent = `Hello ${name},<br><br>Your security staff account has been created for Visitor Management System.<br><br>You can now:<br>• Scan visitor QR codes<br>• Check-in/out visitors<br>• View ongoing visits<br><br>Login with your email and password: ${email}`;
                break;
            case 'client':
                emailSubject = '👔 Welcome Host - Account Created';
                emailContent = `Hello ${name},<br><br>Your host account has been created for Visitor Management System.<br><br>You can now:<br>• Receive visit requests<br>• Approve/reject visits<br>• Get visitor notifications<br><br>Login with your email and password: ${email}`;
                break;
            case 'admin':
                emailSubject = '🛡️ Welcome Administrator - Account Created';
                emailContent = `Hello ${name},<br><br>Your administrator account has been created for Visitor Management System.<br><br>You have full access to:<br>• Manage all users<br>• View all visits<br>• Generate reports<br>• System settings<br><br>Login with your email and password: ${email}`;
                break;
        }

        await sendEmail(email, emailSubject, emailContent);

        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            message: 'User status updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Format date for string comparison (dd-mm-yyyy)
        const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

        const [
            totalVisits,
            pendingVisits,
            approvedVisits,
            ongoingVisits,
            todayVisits,
            totalUsers,
            visitorsCount,
            clientsCount
        ] = await Promise.all([
            Visit.countDocuments(),
            Visit.countDocuments({ status: 'pending' }),
            Visit.countDocuments({ status: 'approved' }),
            Visit.countDocuments({ status: 'ongoing' }),
            Visit.countDocuments({ visitDate: todayStr }),
            User.countDocuments(),
            User.countDocuments({ role: 'visitor' }),
            User.countDocuments({ role: 'client' })
        ]);

        res.json({
            stats: {
                totalVisits,
                pendingVisits,
                approvedVisits,
                ongoingVisits,
                todayVisits,
                totalUsers,
                visitorsCount,
                clientsCount
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};