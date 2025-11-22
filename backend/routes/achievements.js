const express = require('express');
const router = express.Router();
const {
    getAchievements,
    setAchievement,
    updateAchievement,
    deleteAchievement,
} = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

router.route('/').get(getAchievements).post(protect, setAchievement);
router.route('/:id').put(protect, updateAchievement).delete(protect, deleteAchievement);

module.exports = router;
