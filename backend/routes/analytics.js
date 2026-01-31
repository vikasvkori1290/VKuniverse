const express = require('express');
const router = express.Router();
const { getDashboardStats, trackDsaDownload } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.post('/track-dsa', trackDsaDownload);

module.exports = router;
