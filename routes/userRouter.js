const express = require('express');
const router = express.Router();

//import controllers
const { signUp, signIn, forgotPassword, verifyCode, changePassword, setPassword, updateProfile, profile, totalPatients, patients } = require('../controllers/userController');
const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');

// routes
router.post('/sign-up', upload.single("image"), signUp);
router.post('/sign-in', signIn);
router.get('/profile', isValidUser, profile);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/set-password', setPassword);
router.post('/change-password', isValidUser, changePassword);
router.post('/update', upload.single("image"), isValidUser, updateProfile);
router.get('/totall-patients', isValidUser, totalPatients);
router.get('/patients-all', patients);

module.exports = router;