const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new admin (Use once or protect)
// @route   POST /api/auth/register
// @access  Public (should be restricted in production)
const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin
    // Note: Password hashing is handled in the Admin model pre-save hook
    const admin = await Admin.create({
        username,
        email,
        password,
    });

    if (admin) {
        res.status(201).json({
            _id: admin.id,
            username: admin.username,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

// @desc    Authenticate a admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    // Standard login
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin.id,
            username: admin.username,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get admin data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.admin);
};

module.exports = {
    registerAdmin,
    loginAdmin,
    getMe,
};
