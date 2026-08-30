const express = require('express');
const router = express.Router();
const { getDashboardStats, getLikesAnalytics, trackDsaDownload } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/likes', protect, getLikesAnalytics);
router.post('/track-dsa', trackDsaDownload);

module.exports = router;
