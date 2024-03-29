const mongoose = require('mongoose');

const apointmentSchema = new mongoose.Schema({
    packageId: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, required: false },
    paymentStatus: { type: String, required: false },
    referTo: { type: mongoose.Schema.Types.ObjectId, required: false },
},
    { timestamps: true },
);

module.exports = mongoose.model('Apointment', apointmentSchema);