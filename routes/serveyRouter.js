const express = require('express');
const router = express.Router();

//import controllers
const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');
const { createServey, getServey, getServeyAnswer } = require('../controllers/serveyController');


// routes
router.post('/add', createServey);
router.get('/all', getServey);
router.get("/answers", getServeyAnswer);

module.exports = router;