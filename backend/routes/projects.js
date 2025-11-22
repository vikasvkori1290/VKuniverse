const express = require('express');
const router = express.Router();
const {
    getProjects,
    getAdminProjects,
    getProject,
    setProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.route('/').get(getProjects).post(protect, setProject);
router.route('/admin').get(protect, getAdminProjects);
router.route('/:id').get(getProject).put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;
