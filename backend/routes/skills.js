const express = require('express');
const router = express.Router();
const {
    getSkills,
    setSkill,
    updateSkill,
    deleteSkill,
    getRecentSkills,
    fetchIcon,
    searchTech,
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.route('/').get(getSkills).post(protect, setSkill);
router.route('/recent').get(protect, getRecentSkills);
router.route('/fetch-icon').post(protect, fetchIcon);
router.route('/search-tech').get(searchTech);
router.route('/:id').put(protect, updateSkill).delete(protect, deleteSkill);

module.exports = router;
