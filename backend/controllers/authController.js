const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecretkey', {
        expiresIn: '30d',
    });
};

// @desc    Register new admin (Use once or protect)
// @route   POST /api/auth/register
// @access  Public (should be restricted in production)
const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email, and password' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if admin exists
        const adminExists = await Admin.findOne({ 
            $or: [
                { email: normalizedEmail }, 
                { username: username.trim() }
            ] 
        });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin with this email or username already exists' });
        }

        // Create admin
        const admin = await Admin.create({
            username: username.trim(),
            email: normalizedEmail,
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
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

// @desc    Authenticate an admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find admin by email or username
        const admin = await Admin.findOne({
            $or: [
                { email: normalizedEmail },
                { username: email.trim() }
            ]
        });

        if (admin && (await admin.matchPassword(password))) {
            return res.json({
                _id: admin.id,
                username: admin.username,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: error.message || 'Server error during login' });
    }
};

// @desc    Get admin data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(req.admin);
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Server error retrieving admin profile' });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    getMe,
};
