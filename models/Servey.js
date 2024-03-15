const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const serveySchema = new mongoose.Schema({
    question: { type: String, required: true },
    serveyType: { type: String, required: false, enum: ['Individual', 'Couple Therapy', 'Teen Therapy'], default: "Individual" },
    answerType: { type: String, required: false, enum: ['Checkbox', 'Multiple', "Paragraph"], default: "Checkbox" },
},
    { timestamps: true },
);

module.exports = mongoose.model('Servey', serveySchema);