const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    invitee: {
        userId: { type: mongoose.Types.ObjectId, ref: 'User1', default: null },
        isRewarded: { type: Boolean, default: false }
    },
    invites: [{
        userId: { type: mongoose.Types.ObjectId, ref: 'User1' },
        isConfirmed: { type: Boolean, default: false }
    }],
    gamesPlayed: { type: Number, default: 0 }
});

module.exports = mongoose.model('User1', userSchema);