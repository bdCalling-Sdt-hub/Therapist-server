const Response = require("../helpers/response");
const Apointment = require("../models/Apointment");
const Sheidule = require("../models/Sheidule");
const Therapist = require("../models/Therapist");
const User = require("../models/User");

const sheidule = async (req, res) => {
    try {
        const date = req.body.date;
        const therapistId = req.body.userId;
        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            return res.status(400).json(Response({ message: "Therapist not found", type: "Therapist", satus: "Not Found", stausCode: 400 }))
        };
        if (therapist._id.toString() !== therapistId) {
            return res.status(200).json(Response({ message: "Unauthorized", type: "Therapist", status: "Unauthorized", statusCode: 400 }))
        };
        const sheidule = await Sheidule.create({ date, therapistId });
        res.status(201).json(Response({ message: "Sheidule has been created successfully", data: sheidule, type: "Therapist", status: "Success", statusCode: 201 }));
    } catch (error) {
        res.status(500).json(Response({ message: error.message }))
    };
};

const getSheidule = async (req, res) => {
    try {
        const search = Number(req.query.search) || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const searchRexExp = new RegExp(".*" + search + ".*", "i");

        const sheidule = await Sheidule.find()
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await Sheidule.countDocuments();

        res.status(200).json(Response({
            message: "Sheidule has been fetched successfully",
            data: {
                type: "Sheidule",
                attributes: sheidule
            },
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
        const therapistId = req.params.therapistId;
        const patient = await Apointment.findOne({ userId: patientId });
        const therapist = await Therapist.findById(therapistId);
        console.log(patient);
        console.log(therapist);
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
        console.log(userId)
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

module.exports = {
    sheidule,
    getSheidule,
    matchTherapistWithSheidule,
    assignTherapistToPatient,
    apointmentDetailsForDoctors,
    createSheidule,
    bookSchedule
};