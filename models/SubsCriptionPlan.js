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
    duration: {
        type: Number,
        required: true
    },
    liveSession: {
        type: Number,
        required: true
    },
    liveSessionDuaration: {
        type: Number,
        required: true
    },
    weeklyResponse: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);