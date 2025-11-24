const express = require('express');
const router = express.Router();
const {
    createResume,
    getResume,
    updateResume,
    deleteResume,
} = require('../controllers/resumeController');

router.post('/', createResume);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;
