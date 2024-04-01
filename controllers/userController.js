const { userRegister, userLogin, forgotPasswordService, verifyCodeService, changePasswordService, setPasswordService } = require("../services/userService");
const Response = require("../helpers/response");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { createJSONWebToken } = require('../helpers/jsonWebToken');
const { deleteImage } = require("../helpers/deleteImage");

//sign up user
const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const image = req.file;


        // Validate request body
        if (!name) {
            return res.status(400).json(Response({ message: "Name is required" }));
        }

        if (!email) {
            return res.status(400).json(Response({ message: "Email is required" }));
        }

        if (!password) {
            return res.status(400).json(Response({ message: "Password is required" }));
        };

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json(Response({ message: "User already exists" }));
        }

        let userDetails = {
            name,
            email,
            password,
            image
        }

        console.log(userDetails)

        // Call service function to register user
        await userRegister(userDetails);

        res.status(200).json(Response({ message: "A verification email is sent to your email" }));

    } catch (error) {
        console.error("Error in signUp controller:", error);
        res.status(500).json({ error: "Server error" });
    }
};

//Sign in user
const signIn = async (req, res, next) => {
    try {
        // Get email and password from req.body
        const { email, password } = req.body;
        console.log("--------Meow", email)

        // Find the user by email
        const user = await User.findOne({ email });
        console.log("-------------->>>>>", user)

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        // Check if the user is banned
        if (user.isBlocked) {
            return res.status(401).json(Response({ statusCode: 401, message: 'You are blocked', status: "Failed" }));
        }

        if (!user.isVerified && user.oneTimeCode !== "Verified") {
            return res.status(401).json(Response({ statusCode: 401, message: 'You are not verified', status: "Failed" }));
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("---------------", isPasswordValid)

        if (!isPasswordValid) {
            res.status(401).json(Response({ statusCode: 401, message: 'Invalid password', status: "Failed" }));
        }

        // Call userLogin service function
        const accessToken = await userLogin({ email, password, user });

        //Success response
        res.status(200).json(Response({ statusCode: 200, message: 'Authentication successful', status: "OK", data: user, token: accessToken, type: "user" }));

    } catch (error) {
        console.log(error.message);
        next(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await forgotPasswordService(email, user);

        res.status(200).json(Response({ statusCode: 200, message: 'A verification code is sent to your email', status: "OK" }));

    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

//verify code
const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email) {
            console.log("email")
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        if (!code) {
            console.log("code")
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log("user")
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await verifyCodeService({ user, code })

        res.status(200).json(Response({ statusCode: 200, message: 'User verified successfully', status: "OK" }));

    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

//Set password
const setPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("email", email)
        console.log("password", password)

        const user = await User.findOne({ email });
        console.log("user", user)
        if (!email) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Email is required', status: "Failed" }));
        }
        if (!password) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Password is required', status: "Failed" }));
        }

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await setPasswordService({ user, password });

        res.status(200).json(Response({ statusCode: 200, message: 'Password changed successfully', status: "OK" }));

    } catch (error) {
        console.log("error.message", error.message)
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const loggedInUser = await User.findOne({ _id: req.body.userId });
        console.log("loggedInUser", loggedInUser)
        if (!loggedInUser) {
            return res.status(400).json(Response({ message: "Old password is required" }));
        }
        if (!oldPassword) {
            return res.status(400).json(Response({ message: "Old password is required" }));
        }
        if (!newPassword) {
            return res.status(400).json(Response({ message: "New password is required" }));
        }

        let isPasswordValid = await bcrypt.compare(oldPassword, loggedInUser.password);
        if (!isPasswordValid) {
            return res.status(400).json(Response({ message: "Password does not match" }));
        }
        loggedInUser.password = newPassword;
        await loggedInUser.save();
        res.status(200).json(Response({ message: "Password changed successfully" }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(Response({ message: "Internal server error" }))
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const image = req.file;

        console.log("image", image);
        console.log("name", name);
        console.log("email", email);

        // Check if userId is provided and valid
        if (!req.body.userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // Find the user by userId
        const user = await User.findById(req.body.userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields if provided
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        // Handle image update
        if (image) {
            // Delete previous image if it exists
            if (user.image && user.image.path) {
                deleteImage(user.image.path);
            }
            user.image = image;
        }

        // Save the updated user
        await user.save();

        // Return success response
        return res.status(200).json({ message: "Profile updated successfully", user });

    } catch (error) {
        console.error(error);

        // Handle specific types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        } else if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(400).json({ message: "Duplicate key error" });
        }

        // For other errors, return a generic internal server error message
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    signUp,
    signIn,
    forgotPassword,
    verifyCode,
    changePassword,
    setPassword,
    updateProfile
};
