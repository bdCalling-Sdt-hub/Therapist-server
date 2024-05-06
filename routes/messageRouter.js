const express = require('express');
const { getUserSpecificChat } = require('../controllers/messageController');
const { isValidUser } = require('../middlewares.js/auth');
const router = express.Router();

//import controllers


//Import helper functions

// routes
router.get('/:receiverId', isValidUser, getUserSpecificChat);

module.exports = router;