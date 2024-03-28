const express = require('express');
const { sheidule, getSheidule, assignTherapistToPatient } = require('../controllers/sheiduleController');
const { isValidUser } = require('../middlewares.js/auth');
const router = express.Router();

//import controllers

//import middleware

//routes
router.post('/make', isValidUser, sheidule);
router.get('/all', getSheidule);
router.post('/assign', isValidUser, assignTherapistToPatient);


module.exports = router;