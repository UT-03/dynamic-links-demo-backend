const express = require('express');
const { check } = require('express-validator');

const { login, signup } = require('../controllers/Auth');

const router = express.Router();

router.post('/signup',
    [
        check('name')
            .not()
            .isEmpty(),
        check('phoneNumber')
            .not()
            .isEmpty(),
        check('password')
            .isLength({ min: 6 })
    ],
    signup);

router.post('/login', login);

module.exports = router;