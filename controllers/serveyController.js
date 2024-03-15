const Response = require("../helpers/response");
const Survey = require("../models/Servey")
const SurveyAnswer = require("../models/ServeyAnswer")

const createServey = async (req, res) => {
    try {
        const { question, serveyType, answers, correctAnswers } = req.body;
        console.log(answers)

        const createServey = await Survey.create({
            question: question,
            serveyType: serveyType
        });



        const createAnswer = await SurveyAnswer.create({
            answers: answers,
            correctAnswers: correctAnswers,
            questionId: createServey._id,
        });

        const data = {
            createServey,
            createAnswer
        };

        res.status(201).json(Response({ data: data }));
    } catch (error) {
        console.log(error.message)
        res.status(500).json(Response({ error: error }));
    }
};

const getServey = async (req, res) => {
    try {
        const getServey = await Survey.find();
        res.status(200).json(Response({ data: getServey }));
    } catch (error) {
        res.status(500).json(Response({ error: error }));
    }
}

module.exports = {
    createServey,
    getServey
}