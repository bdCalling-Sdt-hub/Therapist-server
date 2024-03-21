const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const meowSchema = new mongoose.Schema({
    title1: { type: String, required: false },
    title2: { type: String, required: false },
    title1image: { type: String, required: false },
    title2image: { type: String, required: false },
},
    { timestamps: true },
);

module.exports = mongoose.model('Meow', meowSchema);