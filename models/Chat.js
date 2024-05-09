// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const chatSchema = new mongoose.Schema({
//     senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     participant: { type: mongoose.Schema.Types.ObjectId, required: true },
// },
//     { timestamps: true },
// );

// module.exports = mongoose.model('Chat', chatSchema);

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' || "Tharpist", required: true },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' || "Tharpist", required: true },
},
    { timestamps: true },
);

module.exports = mongoose.model('Chat', chatSchema);
