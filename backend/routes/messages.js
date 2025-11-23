const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Public route - anyone can send a message
router.post('/', messageController.createMessage);

// Protected routes - admin only
router.get('/', auth, messageController.getAllMessages);
router.put('/:id/read', auth, messageController.markAsRead);
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;
