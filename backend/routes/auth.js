const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;
