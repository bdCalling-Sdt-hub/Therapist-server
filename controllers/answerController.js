const Response = require("../helpers/response");
const Answer = require("../models/Answer");
const User = require("../models/User");

const answer = async (req, res) => {
    try {
        const answerData = req.body;
        console.log(answerData);
        const user = await User.findById(req.body.userId);
        if (user.answer == true) {
            res.status(400).json(Response({ message: "You already answered" }));
        }

        const newAnswer = await Answer({
            answer: answerData
        }); // Create new instance of Answer model
        await newAnswer.save(); // Save the new answer

        user.answer = true;
        await user.save();

        // Send response only after all asynchronous operations are complete
        res.status(200).json({ newAnswer });
    } catch (error) {
        console.log(error);
        // If an error occurs, send an error response
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { answer };
