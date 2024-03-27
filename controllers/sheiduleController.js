const Response = require("../helpers/response");
const Sheidule = require("../models/Sheidule");
const Therapist = require("../models/Therapist");

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
        const sheidule = await Sheidule.find();
        res.status(200).json(Response({ message: "Sheidule has been fetched successfully", data: sheidule, type: "Therapist", status: "Success", statusCode: 200 }))
    } catch (error) {
        res.status(500).json(Response({ message: error.message }));
    };
};

module.exports = { sheidule, getSheidule };