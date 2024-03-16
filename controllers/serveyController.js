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

const getServeyAnswer = async (req, res) => {
    try {
        let surveyQuestionWithAnswer = [];

        // Retrieve all survey answers
        const surveyAnswers = await SurveyAnswer.find();

        // Extract questionIds from survey answers
        const questionIds = surveyAnswers.map(answer => answer.questionId);

        // Retrieve questions based on the extracted questionIds
        const questions = await Survey.find({ _id: { $in: questionIds } });

        // Associate each survey answer with its corresponding question
        surveyQuestionWithAnswer = surveyAnswers.map(answer => {
            const question = questions.find(q => q._id.toString() === answer.questionId.toString());
            return {
                _id: answer._id,
                questionId: answer.questionId,
                question: question, // Adding question to the object
                answers: answer.answers,
                correctAnswers: answer.correctAnswers,
                createdAt: answer.createdAt,
                updatedAt: answer.updatedAt,
                __v: answer.__v
            };
        });

        res.status(200).json({ data: surveyQuestionWithAnswer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createServey,
    getServey,
    getServeyAnswer
}