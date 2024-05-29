const Response = require("../helpers/response");
const Rating = require("../models/Rating");
const Therapist = require("../models/Therapist");

const createRating = async (req, res) => {
    try {
        const therapistId = req.params.therapistId;
        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            res.status(404).json(Response({ message: "Therapist not found", statusCode: 404, status: "Not Found" }))
        }

        const userId = req.body.userId;
        const rating = req.body.rating;
        const newRating = await Rating.create({
            userId: userId,
            therapistId: therapistId,
            rating: rating
        });
        const therapistRatings = await Rating.find({ therapistId: therapistId });
        const therapistRatingsCount = await Rating.countDocuments({ therapistId: therapistId });
        const totalRating = therapistRatings.reduce((sum, doc) => sum + doc.rating, 0);
        // Update the therapist's rating with a rounded value
        therapist.rating = (totalRating / therapistRatingsCount).toFixed(1);
        await therapist.save();
        res.status(201).json(Response({ message: "Rated succesfuly", data: newRating, status: "Created", statusCode: 201 }))
    } catch (error) {

        res.status(500).json(Response({ message: "Internal server Error" }));
    }
};

module.exports = { createRating }