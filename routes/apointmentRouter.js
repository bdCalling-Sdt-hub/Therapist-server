const express = require('express');
const router = express.Router();

//import controllers
const { getApointment, assignDoctor, assignTherapist, myAssignedList } = require('../controllers/apointmentController');

//Import helper functions
const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');

// routes
router.post('/select', isValidUser, getApointment);
router.post('/assign/:id', assignDoctor);
router.get('/assign/:userId', assignTherapist);
router.get('/my-apointment', isValidUser, myAssignedList)

module.exports = router;