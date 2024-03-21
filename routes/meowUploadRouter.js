const express = require('express');
const router = express.Router();

// Import controllers
const { mewoImageUpload } = require('../controllers/meowUplaodController');

// Import the multer middleware
const uploadMiddleware = require('../middlewares.js/meowUpload');

// Route for uploading multiple images from multiple fields
router.post('/meow', uploadMiddleware, mewoImageUpload);

module.exports = router;

