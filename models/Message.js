const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const messageSchema = new mongoose.Schema({
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    sendTime: { type: String, required: true },
},
    { timestamps: true },
);

module.exports = mongoose.model('Message', messageSchema);