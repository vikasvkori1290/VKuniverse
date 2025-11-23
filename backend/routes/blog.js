const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/recent', blogController.getRecentPosts);
router.get('/:slug', blogController.getPostBySlug);

// Protected routes - admin only
router.get('/admin/all', auth, blogController.getAllPostsAdmin);
router.post('/', auth, blogController.createPost);
router.put('/:id', auth, blogController.updatePost);
router.delete('/:id', auth, blogController.deletePost);

module.exports = router;
