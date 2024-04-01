const express = require('express');
const router = express.Router();

//import controllers
const { apply, acceptTherapistRequest, getTherapist, signIn } = require('../controllers/therapistController');

//import middleware
const upload = require('../middlewares.js/fileUpload');
const uploadMiddleware = require('../middlewares.js/multipleUpload');
const { isValidUser } = require('../middlewares.js/auth');

console.log("heeee")
// routes
router.post('/apply', uploadMiddleware, apply);
router.post('/action/:therapistId', isValidUser, acceptTherapistRequest);
router.get('/all', isValidUser, getTherapist);
router.get('/:therapistId', isValidUser, getTherapist);
router.post('/sign-in', signIn);


module.exports = router;