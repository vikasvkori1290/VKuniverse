const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/recent', blogController.getRecentPosts);
router.get('/:slug', blogController.getPostBySlug);

// Protected routes - admin only
router.get('/admin/all', protect, blogController.getAllPostsAdmin);
router.post('/', protect, blogController.createPost);
router.put('/:id', protect, blogController.updatePost);
router.delete('/:id', protect, blogController.deletePost);

module.exports = router;
