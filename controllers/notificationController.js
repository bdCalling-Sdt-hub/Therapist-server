const Sheidule = require("../models/Sheidule");

const sendNotification = async (req, res) => {
    try {
        const checkSchedule = await Sheidule.find({
            userId: { $exists: true, $ne: null }
        });
        console.log(checkSchedule);
    } catch {
        res.status(500).json("Internal server error");
    }
};

module.exports = { sendNotification };