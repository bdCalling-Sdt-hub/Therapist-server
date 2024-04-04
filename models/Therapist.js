const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const therapistSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], minlength: 3, maxlength: 30, },
    email: {
        type: String, required: [true, "Email is required"], minlength: 3, maxlength: 30, trim: true,
        unique: [true, 'Email should be unique'],
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
            },
            message: 'Please enter a valid Email'
        }
    },
    role: { type: String, required: true, enum: ["Patient", "Therapist", "Admin"], default: "Therapist" },
    image: { type: Object, required: false, default: { publicFileURL: "images/users/user.png", path: "public\\images\\users\\user.png" } },
    resume: { type: Object, required: false, default: null },
    certificate: { type: Object, required: false, default: null },
    accepted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    therapistType: { type: String, required: true, enum: ["Individual", "Couple Therapy", "Teen Therapy"], default: "Individual" },
    password: {
        type: String, required: [true, "Password is required"], minlength: 3,
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    isVerified: { type: Boolean, default: false },
    oneTimeCode: { type: String, required: false, default: null },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
        },
    },
},
    { timestamps: true },
);

module.exports = mongoose.model('Therapist', therapistSchema);