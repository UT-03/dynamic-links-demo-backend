const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/User');
const HttpError = require("../util/HttpError");

const signup = async (req, res, next) => {
    // try-catch for handling unexpected errors
    try {
        // If inputs are invalid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpError('Invalid inputs passed, please check your data.', 406);
        }

        // Extracting data from req body
        const { name, phoneNumber, password, inviteeId } = req.body;

        // Searching any existing user with same phoneNumber
        const existingUser = await User.findOne({ phoneNumber: phoneNumber });

        // If user already exists
        if (existingUser) {
            throw new HttpError('User already exists, Please login instead', 406);
            // return next(new HttpError('User exists already, please login instead.', 406));
        }

        // Else => Hashing the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Creating new User
        const newUser = new User({
            name: name,
            phoneNumber: phoneNumber,
            password: hashedPassword,
            invitee: {
                userId: inviteeId ? inviteeId : null
            },
            invites: []
        });

        if (!inviteeId) {
            // Saving new user in DB
            await newUser.save();
        }
        else {
            // Updating the invitee
            const invitee = await User.findById(inviteeId);
            invitee.invites.push({
                userId: newUser._id
            })

            // Updating invitee and invited in a mongoose session
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await newUser.save({ session: sess });
            await invitee.save({ session: sess });
            await sess.commitTransaction();
        }

        // Generating token
        const token = jwt.sign(
            { userId: newUser._id },
            `${process.env.SECRET_TOKEN}`
        );

        // sending new user creation status response
        res
            .status(201)
            .json({
                token: token,
                userId: newUser._id
            })
    } catch (err) {
        if (err instanceof HttpError)
            return next(err);
        else {
            console.log(err);
            return next(new HttpError());
        }
    }
};

const login = async (req, res, next) => {
    // try-catch for handling unexpected errors
    try {
        // Extracting user data from req body
        const { phoneNumber, password } = req.body;

        // Searching if a user with this phoneNumber exists or not
        const existingUser = await User.findOne({ phoneNumber: phoneNumber });

        // If user does not exist
        if (!existingUser) {
            throw new HttpError('User does not exist, please try Sign-up instead.', 404);
        }

        // Else => checking password is correct
        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        // If password is incorrect
        if (!isValidPassword) {
            throw new HttpError('Invalid credentials, could not log you in.', 406);
        }

        // Else => Generating token
        const token = jwt.sign(
            { userId: existingUser._id },
            `${process.env.SECRET_TOKEN}`
        );

        // Sending success response
        res
            .status(200)
            .json({
                token: token,
                userId: existingUser._id
            })
    } catch (err) {
        if (err instanceof HttpError)
            return next(err);
        else {
            console.log(err);
            return next(new HttpError());
        }
    }
};

module.exports = {
    signup,
    login
}