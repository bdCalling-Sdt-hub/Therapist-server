const express = require('express');
const router = express.Router();

//import controllers
const { createPackage, getPackages } = require('../controllers/packageController');

//Import helper functions
const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');

// routes
router.post('/add', createPackage);
router.get('/all', getPackages);

module.exports = router;