const express = require('express');
const router = express.Router();
const {
    getAchievements,
    setAchievement,
    updateAchievement,
    deleteAchievement,
    getRecentAchievements,
    updateCollage,
} = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

router.route('/').get(getAchievements).post(protect, setAchievement);
router.route('/recent').get(protect, getRecentAchievements);
router.route('/:id').put(protect, updateAchievement).delete(protect, deleteAchievement);
router.route('/:id/collage').put(protect, updateCollage);

module.exports = router;
