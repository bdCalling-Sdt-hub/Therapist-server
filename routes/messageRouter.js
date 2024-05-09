const express = require('express');
const { getUserSpecificChat, getChatList } = require('../controllers/messageController');
const { isValidUser } = require('../middlewares.js/auth');
const router = express.Router();

//import controllers


//Import helper functions

// routes
router.get('/chat/:participant', isValidUser, getUserSpecificChat);
router.get('/chat-list', isValidUser, getChatList);

module.exports = router;