const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const messageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    message: { type: String, required: true },
    sendTime: { type: String, required: true },
},
    { timestamps: true },
);

module.exports = mongoose.model('Message', messageSchema);