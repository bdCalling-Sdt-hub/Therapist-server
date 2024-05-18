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

};

const assignDoctor = async (req, res) => {
    try {
        console.log("meow")
        const doctorId = req.body.doctorId;
        const appointment = await Apointment.findById(req.params.id);
        console.log(appointment);
        if (!appointment) {
            res.status(404).json(Response({ message: "Appointment not found", type: "Appointment", status: "Not Found", statusCode: 404 }));
            return;
        }
        appointment.referTo = req.body.doctorId;
        await appointment.save();
        res.status(200).json(Response({ message: "Doctor assigned successfully", data: appointment, type: "Appointment", status: "OK", statusCode: 200 }));
    } catch (error) {
        res.status(500).json(Response({ message: "Internal Server Error", type: "Appointment", status: "Internal Server Error", statusCode: 500 }));
    }
};

const assignTherapist = async (req, res) => {
    try {
        const therapist = req.body.therapistId;
        const user = req.params.userId;
        console.log(user)
        console.log(therapist)
        const apointment = await Apointment.create({
            userId: user,
            therapistId: therapist
        });
        res.status(200).json(Response({ "message": "Therapist assign succesfuly", statusCode: 200, status: "Okay", data: apointment }))
    } catch (error) {
        res.status(500).json("Internal server error")
    }
};

const myAssignedList = async (req, res) => {
    try {
        const userId = req.body.userId;
        const myAssignment = await Apointment.findOne({
            $or: [
                { userId: userId },
                { therapistId: userId }
            ]
        });
        console.log(myAssignment)
        res.status(200).json(Response({ message: "My apointment", data: myAssignment, status: "Okay", statusCode: 200 }))
    } catch (error) {
        res.status(500).json(Response({ message: "Internal server Error" }))
    }
}

const schedule = async (req, res) => {
    const { date, time } = req.body;
    const apointment = await Apointment.create({ userId: req.user._id, date, time });

};

module.exports = {
    getApointment,
    assignDoctor,
    assignTherapist,
    myAssignedList
}