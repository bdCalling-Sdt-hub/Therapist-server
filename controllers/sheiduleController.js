const Response = require("../helpers/response");
const Apointment = require("../models/Apointment");
const Sheidule = require("../models/Sheidule");
const Therapist = require("../models/Therapist");
const User = require("../models/User");
const mongoose = require('mongoose');

// const sheidule = async (req, res) => {
//     try {
//         const date = req.body.date;
//         const times = req.body.time;
//         const therapistId = req.body.userId;

//         // Validate the therapist
//         const therapist = await Therapist.findById(therapistId);
//         if (!therapist) {
//             return res.status(400).json(Response({ message: "Therapist not found", type: "Therapist", status: "Not Found", statusCode: 400 }));
//         }

//         // Unauthorized check (though this seems redundant if `findById` was used correctly)
//         if (therapist._id.toString() !== therapistId) {
//             return res.status(400).json(Response({ message: "Unauthorized", type: "Therapist", status: "Unauthorized", statusCode: 400 }));
//         }

//         // Iterate over times and create separate documents for each time
//         const schedules = await Promise.all(times.map(async (time) => {
//             return await Sheidule.create({ date, time, therapistId });
//         }));

//         res.status(201).json(Response({ message: "Schedules have been created successfully", data: schedules, type: "Therapist", status: "Success", statusCode: 201 }));
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json(Response({ message: error.message }));
//     }
// };

const sheidule = async (req, res) => {
    try {
        const { date, time: times, userId: therapistId } = req.body;

        // Validate the therapist
        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            return res.status(400).json({
                message: "Therapist not found",
                type: "Therapist",
                status: "Not Found",
                statusCode: 400
            });
        }

        // Convert date to 'YYYY-MM-DD' format
        const formattedDate = new Date(date).toISOString().split('T')[0];

        // Check for existing schedules with the same date and time
        const existingSchedules = await Sheidule.find({
            therapistId,
            date: formattedDate,
            time: { $in: times }
        });

        if (existingSchedules.length > 0) {
            return res.status(400).json(Response({
                message: "You already have schedule on this time, please select different",
                type: "Schedule",
                status: "Conflict",
                statusCode: 400
            }));
        }

        // Iterate over times and create separate documents for each time
        const schedules = await Promise.all(times.map(async (time) => {
            return await Sheidule.create({ date: formattedDate, time, therapistId });
        }));

        res.status(201).json({
            message: "Schedules have been created successfully",
            data: schedules,
            type: "Schedule",
            status: "Success",
            statusCode: 201
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


const getSheidule = async (req, res) => {
    try {
        const therapistId = req.params.therapistId;
        const date = req.params.date;
        const modifiedDate = date.includes('T') ? date.split('T')[0] : date;
        console.log(date)
        const search = Number(req.query.search) || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const searchRexExp = new RegExp(".*" + search + ".*", "i");
        const userId = req.body.userId;

        const sheidule = await Sheidule.find({
            therapistId: therapistId,
            date: modifiedDate,
            isBooked: { $ne: true }
        })
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await Sheidule.countDocuments();

        res.status(200).json(Response({
            message: "Sheidule has been fetched successfully",
            data: sheidule,
            type: "Sheidule",
            status: "Success",
            statusCode: 200,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalItems: count,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : null
            }
        }));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response({ message: error.message }));
    };
};

const matchTherapistWithSheidule = async (req, res) => {
    try {
        console.log(req.body.patientId);
        const admin = await User.findById(req.body.userId);
        if (!admin) {
            return res.status(400).json(Response({ message: "Admin not found", type: "Admin", status: "Not Found", statusCode: 400 }))
        }
        if (!admin.isAdmin) {
            return res.status(401).json(Response({ message: "Unauthorized", type: "Admin", status: "Unauthorized", statusCode: 401 }))
        }
        const sheidules = await Sheidule.find();

        const patient = await Apointment.findOne({ userId: req.body.patientId });

        if (!patient) {
            return res.status(400).json(Response({ message: "Patient not found", type: "Patient", status: "Not Found", statusCode: 400 }))
        }

        // Filter sheidules based on date match with patient's date
        const matchedSheidules = sheidules.filter(sheidule => {
            return sheidule.date.getTime() === patient.date.getTime();
        });

        // Now matchedSheidules contains only the schedules whose date matches the patient's date
        res.status(200).json(Response({ message: "Sheidules have been fetched successfully", data: matchedSheidules, type: "Sheidule", status: "Success", statusCode: 200 }));

    } catch (error) {
        console.log(error)
        res.status(500).json(Response({ message: error.message }));
    }
};

const assignTherapistToPatient = async (req, res) => {
    try {

        const admin = await User.findById(req.body.userId);
        if (!admin) {
            return res.status(400).json(Response({ message: "Admin not found", type: "Admin", status: "Not Found", statusCode: 400 }))
        }
        if (!admin.isAdmin) {
            return res.status(401).json(Response({ message: "Unauthorized", type: "Admin", status: "Unauthorized", statusCode: 401 }))
        }
        const patientId = req.body.patientId;
        const therapistId = req.body.therapistId;
        const patient = await Apointment.findOne({ userId: patientId });
        const therapist = await Therapist.findById(therapistId);
        console.log("h-------", patient);
        console.log("h-------", therapist);
        if (!patient) {
            return res.status(400).json(Response({ message: "Patient not found", type: "Patient", status: "Not Found", statusCode: 400 }))
        }
        patient.referTo = therapistId;
        await patient.save();
        res.status(200).json(Response({ message: "Therapist has been assigned to the patient successfully", data: patient, type: "Patient", status: "Success", statusCode: 200 }));
    } catch (error) {
        res.status(500).json(Response({ message: error.message }));
    }
};

const apointmentDetailsForDoctors = async (req, res) => {
    try {
        console.log(req.body.userId);
        const therapistId = req.body.userId
        const therapist = await Therapist.findById(therapistId);
        console.log(therapist)
        if (!therapist) {
            return res.status(400).json(Response({ message: "Therapist not found", type: "Therapist", status: "Not Found", statusCode: 400 }))
        }
        if (therapist._id === therapistId) {
            return res.status(401).json(Response({ message: "Unauthorized", data: therapist, type: "Therapist", status: "Unauthorized", statusCode: 401 }))
        }
        const patient = await Apointment.find({ referTo: therapistId });
        res.status(200).json(Response({ message: "Patient has been fetched successfully", data: patient, type: "Patient", status: "Success", statusCode: 200 }));
    } catch (error) {
        res.status(500).json(Response({ message: error.message }));
    }
};

const createSheidule = async (req, res) => {
    try {
        const { sheidule } = req.body;
        const adminId = req.body.userId;
        const admin = await User.findById(adminId);
        if (sheidule.date.length < 1) {
            return res.status(400).json(Response({ message: "Date is required", type: "Sheidule", status: "Bad Request", statusCode: 400 }))
        };
        if (!admin) {
            return res.status(400).json(Response({ message: "Admin not found", type: "Admin", status: "Not Found", statusCode: 400 }))
        }
        if (!admin.isAdmin) {
            return res.status(401).json(Response({ message: "Unauthorized", type: "Admin", status: "Unauthorized", statusCode: 401 }))
        }
        const newsSheidule = await Sheidule.create(sheidule);
        res.status(201).json(Response({ message: "Sheidule has been created successfully", data: newsSheidule, type: "Sheidule", status: "Success", statusCode: 201 }))
    } catch (error) {
        res.status(500).json(Response({ message: error.message }));
    }
};

const bookSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.scheduleId;
        const userId = req.body.userId;
        console.log("meow", userId)
        const sheidule = await Sheidule.findById(scheduleId);

        const apointment = await Apointment.findOne({ userId: userId });
        console.log("hiiiiiiiiii", apointment)
        apointment.scheduleId = scheduleId;
        sheidule.userId = userId;
        sheidule.isBooked = true;
        await sheidule.save();
        await apointment.save();
        res.status(200).json({ message: "Schedule booked succesfuly", data: sheidule, status: "Okay", stausCode: 200 })
    } catch (error) {
        console.log(error.message)
        res.status(500).json(Response({ message: "Internal server Error" }))
    }
};

const getSheiduleByTherapist = async (req, res) => {
    try {
        console.log("meow")
        const date = req.params.date;
        const modifiedDate = date.includes('T') ? date.split('T')[0] : date;
        const therapistId = req.body.userId;
        console.log(therapistId)
        const therapistSchedule = await Sheidule.find({ therapistId: therapistId, date: modifiedDate });
        if (!therapistSchedule) {
            res.status(404).json(Response({ message: "No schedule found on this date", status: "Not Found", statusCode: 404 }))
        }
        res.status(200).json(Response({ message: "Therapist sheidule get succesfully", data: therapistSchedule, status: "Okay", statusCode: 200 }))
    } catch (error) {
        res.status(200).json(Response({ message: "Internal server error" }));
    }
};

const completedSession = async (req, res) => {
    try {
        const therapistId = req.body.userId;
        console.log("hiiiiiiiiiii", therapistId)
        const completedSession = await Sheidule.countDocuments({ therapistId: therapistId, completed: true })
        const totalSession = await Sheidule.countDocuments({ therapistId: therapistId, completed: false })

        console.log(completedSession)
        res.status(200).json(Response({ message: "Completed session count", data: { completedSession: completedSession, totalSession: totalSession }, status: "Okay", stausCode: 200 }))
    } catch (error) {
        res.status(500).json(Response({ message: "Internal server error" }))
    }
}

module.exports = {
    sheidule,
    getSheidule,
    matchTherapistWithSheidule,
    assignTherapistToPatient,
    apointmentDetailsForDoctors,
    createSheidule,
    bookSchedule,
    getSheiduleByTherapist,
    completedSession
};