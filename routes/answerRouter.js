const express = require('express');
const router = express.Router();

//import controllers
const { answer } = require('../controllers/answerController');

//Import helper functions
const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');

// routes
router.post('/', answer);

module.exports = router;