const Response = require("../helpers/response");
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
        }
        const sheidule = await Sheidule.create({ date, therapistId });
        res.status(201).json(Response({ message: "Sheidule has been created successfully", data: sheidule, type: "Therapist", status: "Success", statusCode: 201 }))
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

const assignTherapistToPatient = async (req, res) => {
    try {
        const admin = await User.findById(req.body.userId);
        if (!admin) {
            return res.status(400).json(Response({ message: "Admin not found", type: "Admin", status: "Not Found", statusCode: 400 }))
        }
        if (!admin.isAdmin) {
            res.status(401).json(Response({ message: "Unauthorized", type: "Admin", status: "Unauthorized", statusCode: 401 }))
        }
        console.log(admin);
    } catch (error) {

    }
};

module.exports = { sheidule, getSheidule, assignTherapistToPatient };