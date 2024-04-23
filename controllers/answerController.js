const Answer = require("../models/Answer");

const answer = async (req, res) => {
    try {
        const answerData = req.body; // Renamed variable to avoid conflict with function name
        console.log(answerData);

        const newAnswer = await Answer({
            answer: answerData
        }); // Create new instance of Answer model
        await newAnswer.save(); // Save the new answer

        console.log(newAnswer);
        res.status(200).json({ newAnswer });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { answer };
