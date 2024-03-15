const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [ true, "Name is required"], minlength: 3, maxlength: 30, },
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
    password: {
        type: String, required: [true, "Password is required"], minlength: 3,
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    privacyPolicyAccepted: { type: Boolean, default: false, required: true },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    image: { type: Object, required: false, default: { publicFileURL: "images/users/user.png", path: "public\\images\\users\\user.png" } },
    subscription: { type: String, required: true, enum: ["free", "standard", "premium"], default: "free" },
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

module.exports = mongoose.model('User', userSchema);