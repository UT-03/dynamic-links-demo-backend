const express = require('express');

const { playGame, confirmInviteeReward } = require('../controllers/User');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.post('/play-game', checkAuth, playGame);

router.post('/confirm-reward', checkAuth, confirmInviteeReward);

module.exports = router;