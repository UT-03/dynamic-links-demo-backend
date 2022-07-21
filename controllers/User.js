const mongoose = require('mongoose');

const User = require('../models/User');
const HttpError = require('../util/HttpError');

const playGame = async (req, res, next) => {
    // try-catch for handling unexpected errors
    try {
        const { userId } = req.userData;

        // Fetching user details from DB
        const user = await User.findById(userId);

        // If user does not exist (highly unlikely)
        if (!user)
            throw new HttpError('User does not exist. Please signup first.', 404);

        // Updating games played field (Could do any thing here)
        user.gamesPlayed += 1;

        // Updating user in DB
        await user.save();

        res.json({
            message: "game played"
        })
    } catch (err) {
        if (err instanceof HttpError)
            return next(err);
        else {
            console.log(err);
            return next(new HttpError());
        }
    }
}

const confirmInviteeReward = async (req, res, next) => {
    // try-catch for handling unexpected errors
    try {
        const { userId } = req.userData;

        // Fetching user details from DB
        const user = await User.findById(userId).select('invitee');

        // If user does not exist (highly unlikely)
        if (!user)
            throw new HttpError('User does not exist. Please signup first.', 404);

        // Checking if the user was invited
        if (user.invitee.userId === null)
            throw new HttpError('User was not invited by anyone.', 404);

        // Checking if the invitee was already rewarded => sending confirmation
        if (user.invitee.isRewarded) {
            return res.json({
                message: "Invitee rewarded"
            })
        }

        // Updating user's details
        user.invitee.isRewarded = true;

        // Fetching and updating invitee details from DB
        const invitee = await User.findById(user.invitee.userId).select('invites');
        const indexToBeConfirmed = invitee.invites.findIndex(usr => usr.userId.toString() === user._id.toString());
        invitee.invites[indexToBeConfirmed].isConfirmed = true;

        // Updating invitee and invited in a mongoose session
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await user.save({ session: sess });
        await invitee.save({ session: sess });
        await sess.commitTransaction();

        res.json({
            message: "First game played"
        })
    } catch (err) {
        if (err instanceof HttpError)
            return next(err);
        else {
            console.log(err);
            return next(new HttpError());
        }
    }
}

const getInviteLink = async (req, res, next) => {
    const { userId } = req.userData;

    const user = await User.findById(userId).select('inviteLink');

    console.log(user);

    res.json({
        inviteLink: user.inviteLink
    })
}

module.exports = {
    playGame,
    confirmInviteeReward,
    getInviteLink
};