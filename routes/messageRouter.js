const express = require('express');
const { getUserSpecificChat } = require('../controllers/messageController');
const router = express.Router();

//import controllers


//Import helper functions

// routes
router.get('/:chatId', getUserSpecificChat);

module.exports = router;