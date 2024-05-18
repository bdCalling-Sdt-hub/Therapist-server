const express = require('express');
const { sheidule, getSheidule, assignTherapistToPatient, matchTherapistWithSheidule, apointmentDetailsForDoctors, createSheidule } = require('../controllers/sheiduleController');
const { isValidUser } = require('../middlewares.js/auth');
const { bookSchedule } = require('../controllers/sheiduleController');
const router = express.Router();

//import controllers

//import middleware

//routes
router.post('/make', isValidUser, sheidule);
router.get('/all', getSheidule);
router.post('/match', isValidUser, matchTherapistWithSheidule);
router.post('/assign/:therapistId', isValidUser, assignTherapistToPatient);
router.get('/apointment/details', isValidUser, apointmentDetailsForDoctors);
router.post('/create', isValidUser, createSheidule)
router.post('/book/:scheduleId', isValidUser, bookSchedule)


module.exports = router;