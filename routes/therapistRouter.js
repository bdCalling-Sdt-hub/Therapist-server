const express = require('express');
const router = express.Router();

//import controllers
const { apply, acceptTherapistRequest, getTherapist, signIn, therapistProfile, updateTherapist, newTherapistForMessage } = require('../controllers/therapistController');

//import middleware
const upload = require('../middlewares.js/fileUpload');
const uploadMiddleware = require('../middlewares.js/multipleUpload');
const { isValidUser } = require('../middlewares.js/auth');

console.log("heeee")
// routes
router.post('/apply', uploadMiddleware, apply);
router.get('/therapist-profile', isValidUser, therapistProfile);
router.post('/action/:therapistId', isValidUser, acceptTherapistRequest);
router.get('/all', isValidUser, getTherapist);
router.get('/:therapistId', isValidUser, getTherapist);
router.post('/sign-in', signIn);
router.post('/update', upload.single("image"), isValidUser, updateTherapist);
router.get('/welcome-message/default', newTherapistForMessage);



module.exports = router;