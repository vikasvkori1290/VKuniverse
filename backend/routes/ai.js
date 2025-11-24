const express = require('express');
const router = express.Router();
const { enhanceContent } = require('../controllers/aiController');

router.post('/enhance', enhanceContent);

module.exports = router;
