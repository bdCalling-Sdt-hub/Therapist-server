const Response = require("../helpers/response");
const Apointment = require("../models/Apointment");
const Package = require("../models/Package");
const User = require("../models/User");

const getApointment = async (req, res) => {
    const { packageId, date, time } = req.body;
    const package = await Package.findById(packageId);
    if (!package) {
        res.status(404).json(Response({ message: "Package not found", type: "Package", status: "Not Found", statusCode: 404 }));
        return;
    }
    const checkUser = await User.findOne({ _id: req.body.userId });
    if (!checkUser) {
        res.status(401).json(Response({ message: "Unauthorized", type: "Package", status: "Unauthorized", statusCode: 401 }));
    }
    const apointment = await Apointment.create({ userId: checkUser._id, packageId, date, time });

    res.status(200).json(Response({ message: "Package selected successfully", data: apointment, type: "Package", status: "OK", statusCode: 200 }));

}

module.exports = {
    getApointment
}