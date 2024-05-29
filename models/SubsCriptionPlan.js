const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    videoCount: {
        type: Number,
        required: false
    },
    audioCount: {
        type: Number,
        required: false
    },
    duration: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);