const express = require('express');
const router = express.Router();

//import controllers
const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');
const { createServey, getServey } = require('../controllers/serveyController');


// routes
router.post('/add', createServey);
router.get('/get', getServey);

module.exports = router;