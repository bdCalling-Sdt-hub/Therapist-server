const express = require('express');
const { sheidule, getSheidule } = require('../controllers/sheiduleController');
const { isValidUser } = require('../middlewares.js/auth');
const router = express.Router();

//import controllers

//import middleware

//routes
router.post('/make', isValidUser, sheidule);
router.get('/all', getSheidule);


module.exports = router;