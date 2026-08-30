const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getLikesAnalytics,
    deleteUserLikes,
    deleteSingleLike,
    trackDsaDownload
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/likes', protect, getLikesAnalytics);
router.delete('/likes/user/:name', protect, deleteUserLikes);
router.delete('/likes/single', protect, deleteSingleLike);
router.post('/track-dsa', trackDsaDownload);

module.exports = router;
