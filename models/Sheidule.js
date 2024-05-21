const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sheiduleSchema = new mongoose.Schema({
    date: { type: String, required: [true, "Data is required"], minlength: 3, maxlength: 30, },
    time: { type: Array, required: [true, "Time is required"] },
    therapistId: { type: mongoose.Schema.Types.ObjectId, required: true },
    isBooked: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: false }
},
    { timestamps: true },
);

module.exports = mongoose.model('Sheidule', sheiduleSchema);