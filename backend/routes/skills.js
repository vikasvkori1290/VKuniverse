const express = require('express');
const router = express.Router();
const {
    getSkills,
    setSkill,
    updateSkill,
    deleteSkill,
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.route('/').get(getSkills).post(protect, setSkill);
router.route('/:id').put(protect, updateSkill).delete(protect, deleteSkill);

module.exports = router;
