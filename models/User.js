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
    }]
});

module.exports = mongoose.model('User1', userSchema);