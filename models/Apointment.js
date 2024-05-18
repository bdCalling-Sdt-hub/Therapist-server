const mongoose = require('mongoose');

const apointmentSchema = new mongoose.Schema({
    packageId: { type: String, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: false },
    date: { type: Date, required: false },
    time: { type: String, required: false },
    status: { type: String, required: false },
    paymentStatus: { type: String, required: false },
    therapistId: { type: mongoose.Schema.Types.ObjectId, required: false },
},
    { timestamps: true },
);

module.exports = mongoose.model('Apointment', apointmentSchema);