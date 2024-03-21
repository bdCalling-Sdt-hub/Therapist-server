const express = require('express');
const router = express.Router();

//import controllers
const { getApointment } = require('../controllers/apointmentController');

//Import helper functions
const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');

// routes
router.post('/select', isValidUser, getApointment);

module.exports = router;