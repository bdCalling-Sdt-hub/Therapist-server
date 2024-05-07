// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const chatSchema = new mongoose.Schema({
//     senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
// },
//     { timestamps: true },
// );

// module.exports = mongoose.model('Chat', chatSchema);

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
    { timestamps: true },
);

module.exports = mongoose.model('Chat', chatSchema);
