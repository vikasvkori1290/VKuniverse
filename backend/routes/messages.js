const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// Public route - anyone can send a message
router.post('/', messageController.createMessage);

// Protected routes - admin only
router.get('/', protect, messageController.getAllMessages);
router.put('/:id/read', protect, messageController.markAsRead);
router.delete('/:id', protect, messageController.deleteMessage);

module.exports = router;
