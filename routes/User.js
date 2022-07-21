const express = require('express');

const { playGame, confirmInviteeReward, getInviteLink } = require('../controllers/User');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.post('/play-game', checkAuth, playGame);

router.post('/confirm-reward', checkAuth, confirmInviteeReward);

router.get('/invite-link', checkAuth, getInviteLink);

module.exports = router;