const pagination = require("../helpers/pagination");
const Response = require("../helpers/response");
const Apointment = require("../models/Apointment");
const Package = require("../models/Package");
const Sheidule = require("../models/Sheidule");
const User = require("../models/User");
const { sheidule } = require("./sheiduleController");

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

// const assignDoctor = async (req, res) => {
//     try {
//         console.log("meow")
//         const doctorId = req.body.doctorId;
//         const appointment = await Apointment.findById(req.params.id);
//         console.log(appointment);
//         if (!appointment) {
//             res.status(404).json(Response({ message: "Appointment not found", type: "Appointment", status: "Not Found", statusCode: 404 }));
//             return;
//         }
//         appointment.referTo = req.body.doctorId;
//         await appointment.save();
//         res.status(200).json(Response({ message: "Doctor assigned successfully", data: appointment, type: "Appointment", status: "OK", statusCode: 200 }));
//     } catch (error) {
//         res.status(500).json(Response({ message: "Internal Server Error", type: "Appointment", status: "Internal Server Error", statusCode: 500 }));
//     }
// };

const assignTherapist = async (req, res) => {
    try {
        const therapist = req.body.therapistId;
        const user = req.params.userId;
        // console.log("hiii", user)
        // console.log("hello", therapist)
        const apointment = await Apointment.create({
            userId: user,
            therapistId: therapist
        });
        res.status(200).json(Response({ message: "Therapist assign succesfuly", statusCode: 200, status: "Okay", data: apointment }))
    } catch (error) {
        console.log(error.message)
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
        })
            .populate("userId")
            .populate("therapistId")
            .populate("scheduleId");

        console.log(myAssignment);
        res.status(200).json(Response({ message: "My appointment", data: myAssignment, status: "Okay", statusCode: 200 }));
    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ message: "Internal server Error" }));
    }
};

const schedule = async (req, res) => {
    const { date, time } = req.body;
    const apointment = await Apointment.create({ userId: req.user._id, date, time });

};

const userApointmentHistory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const date = req.query.date;
        const userId = req.body.userId;

        // Log userId for debugging
        console.log("User ID:", userId);

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                statusCode: 400,
                status: "Bad Request"
            });
        }

        // Validate limit and page number
        if (isNaN(limit) || limit < 1) {
            return res.status(400).json({
                message: "Invalid limit number",
                statusCode: 400,
                status: "Bad Request"
            });
        }
        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                message: "Invalid page number",
                statusCode: 400,
                status: "Bad Request"
            });
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Construct query object
        let query = { $or: [{ userId: userId }, { therapistId: userId }], isBooked: true };
        if (date) {
            query.date = date;
        }

        // Fetch appointments with pagination
        const appointments = await Sheidule.find(query)
            .populate("therapistId")
            .populate("userId")
            .skip(skip)
            .limit(limit);

        // Check if appointments were found
        if (!appointments || appointments.length === 0) {
            return res.status(404).json(Response({
                message: "No appointments found",
                statusCode: 404,
                status: "Not Found"
            }));
        }

        // Count total appointments for pagination info
        const totalAppointments = await Sheidule.countDocuments(query);

        // Prepare pagination info
        const pageInfo = pagination(totalAppointments, limit, page);

        res.status(200).json(Response({
            message: "Schedule retrieved successfully",
            data: appointments,
            statusCode: 200,
            status: "Okay",
            pagination: pageInfo
        }));
    } catch (error) {
        console.error("Error retrieving appointment history:", error.message);
        res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
            status: "Error"
        });
    }
};




module.exports = {
    getApointment,
    // assignDoctor,
    assignTherapist,
    myAssignedList,
    userApointmentHistory
};