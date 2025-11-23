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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
        username,
        email,
        password: hashedPassword, // In the model we also have pre-save hook, so we can just pass password if we remove the manual hash here. 
        // Actually, since I added a pre-save hook in the model, I should just pass the plain password.
        // Let's fix that.
    });

    // Wait, if I pass hashed password to create, the pre-save hook might hash it again if I'm not careful.
    // The pre-save hook checks `isModified('password')`.
    // If I pass the plain password, it will be hashed.
    // Let's correct this to pass plain password and let the model handle hashing.

    // RE-WRITING LOGIC TO USE MODEL HOOK
};

// Correct implementation below
const registerAdminCorrect = async (req, res) => {
    const { username, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

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
}

// @desc    Authenticate a admin
// @route   POST /api/auth/login
// @access  Public
// @desc    Authenticate a admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    // Hardcoded check for specific user
    if (email === 'vikasvkori129@gmail.com' && password === '18Nov2005') {
        let admin = await Admin.findOne({ email });

        if (!admin) {
            // Auto-create if doesn't exist
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            admin = await Admin.create({
                username: 'Vikas V',
                email: email,
                password: hashedPassword
            });
        }

        return res.json({
            _id: admin.id,
            username: admin.username,
            email: admin.email,
            token: generateToken(admin._id),
        });
    }

    // Standard login for other users (if any)
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
    registerAdmin: registerAdminCorrect,
    loginAdmin,
    getMe,
};
