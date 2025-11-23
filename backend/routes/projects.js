const express = require('express');
const router = express.Router();
const {
    getProjects,
    getAdminProjects,
    getProject,
    setProject,
    updateProject,
    deleteProject,
    getRecentProjects,
    setThumbnail,
    reorderImages,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.route('/').get(getProjects).post(protect, setProject);
router.route('/admin').get(protect, getAdminProjects);
router.route('/recent').get(protect, getRecentProjects);
router.route('/:id').get(getProject).put(protect, updateProject).delete(protect, deleteProject);
router.route('/:id/thumbnail').put(protect, setThumbnail);
router.route('/:id/reorder-images').put(protect, reorderImages);

module.exports = router;
