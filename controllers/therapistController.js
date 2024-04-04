const Response = require("../helpers/response");
const SelectTherapy = require("../models/SelectTherapy");
const Therapist = require("../models/Therapist");
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const { userLogin } = require("../services/userService");
const { createJSONWebToken } = require("../helpers/jsonWebToken");
const emailWithNodemailer = require("../helpers/email");

const apply = async (req, res) => {
    try {
        const { name, email, password, therapistType } = req.body;
        const image = req.files['image'];
        const certificate = req.files['certificate'];
        const resume = req.files['resume'];

        // Generate OTC (One-Time Code)
        const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        // Prepare email for activate user
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
          <h1>Hello, ${name}</h1>
          <p>Your One Time Code is <h3>${oneTimeCode}</h3> to verify your email</p>
          <small>This Code is valid for 3 minutes</small>
          `
        }

        // Send email
        try {
            emailWithNodemailer(emailData);
        } catch (emailError) {
            console.error('Failed to send verification email', emailError);
            res.status(500).json({ message: 'Error creating user', error: emailError });
        }

        const therapistExists = await Therapist.findOne({ email });
        if (therapistExists) {
            return res.status(400).json(Response({ message: "Email already exists", status: "Bad Request", statusCode: 400 }));
        }
        const therapist = await Therapist.create({
            name,
            resume,
            therapistType,
            certificate,
            email,
            password,
            image,
            oneTimeCode,
        });

        // Set a timeout to update the oneTimeCode to null after 1 minute
        setTimeout(async () => {
            try {
                therapist.oneTimeCode = null;
                await therapist.save();
                console.log('oneTimeCode reset to null after 3 minutes');
            } catch (error) {
                console.error('Error updating oneTimeCode:', error);
            }
        }, 180000); // 3 minutes in milliseconds
        res.status(201).json(Response({ message: "Apply as a therapist is successfully", status: "Created", statusCode: "201", data: therapist }));
    } catch (error) {
        console.log(error.message);
        res.status(500).json(Response({ message: "Internal server error", status: "Internal Server Error", statusCode: "500" }));
    }
};

//Sign in user
const signIn = async (req, res, next) => {
    try {
        // Get email and password from req.body
        const { email, password } = req.body;
        console.log(email, password)


        // Find the user by email
        const therapist = await Therapist.findOne({ email: email });

        if (!therapist) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        // Check if the user is banned
        if (therapist.isBlocked) {
            return res.status(401).json(Response({ statusCode: 401, message: 'You are blocked', status: "Failed" }));
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = bcrypt.compare(password, therapist.password);
        console.log("---------------", isPasswordValid)

        if (!isPasswordValid) {
            res.status(401).json(Response({ statusCode: 401, message: 'Invalid password', status: "Failed" }));
        }

        // Call userLogin service function
        // const accessToken = await userLogin({ email, password, therapist });
        const expiresInOneYear = 365 * 24 * 60 * 60; // seconds in 1 year
        const accessToken = createJSONWebToken({ _id: therapist._id, email: therapist.email }, process.env.JWT_SECRET_KEY, expiresInOneYear);

        //Success response
        res.status(200).json(Response({ statusCode: 200, message: 'Authentication successful', status: "OK", data: therapist, token: accessToken, type: "user" }));

    } catch (error) {
        console.log(error.message);
        next(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

const acceptTherapistRequest = async (req, res) => {
    try {
        const { therapistId } = req.params;
        const actionType = req.body.actionType;
        console.log(therapistId);
        const checkAdmin = await User.findById(req.body.userId);
        if (checkAdmin.isAdmin !== true) {
            return res.status(400).json(Response({ message: "You are not authorize", status: "Bad Request", statusCode: "400" }));
        }

        const therapist = await Therapist.findById(therapistId);
        console.log(therapist);
        if (!therapist) {
            return res.status(404).json(Response({ message: "Therapist not found", status: "Not Found", statusCode: "404" }));
        }
        if (therapist.accepted === true) {
            return res.status(400).json(Response({ message: "Therapist already accepted", status: "Bad Request", statusCode: "400" }));
        }
        if (actionType === "delete") {
            await Therapist.deleteOne(therapist._id);
            return res.status(400).json(Response({ message: "Therapist request delete successfully", status: "OK", statusCode: "200" }));
        }
        therapist.accepted = true;
        await therapist.save();
        res.status(200).json(Response({ message: "Therapist accepted successfully", status: "OK", statusCode: "200" }));
    } catch (error) {
        console.log(error.message);
        res.status(500).json(Response({ message: "Internal Server Error", status: "Internal Server Error", statusCode: "500" }));
    }
};

const getTherapist = async (req, res) => {
    try {
        const therapist = await Therapist.find();
        res.status(200).json(Response({ message: "Therapist found successfully", status: "OK", statusCode: "200", data: therapist }));
    } catch (error) {
        res.status(500).json(Response({ message: "Internal Server Error", status: "Internal Server Error", statusCode: "500" }));
    }
};

const getSingleUser = async (req, res) => {
    try {
        const { userId } = req.body.userId;
        const user = await User.findById(userId);
    } catch (error) {
        res.status(500).json(Response({ message: "Internal Server Error", status: "Internal Server Error", statusCode: "500" }));
    }
};

module.exports = {
    apply,
    acceptTherapistRequest,
    getTherapist,
    getSingleUser,
    getSingleUser,
    signIn
}