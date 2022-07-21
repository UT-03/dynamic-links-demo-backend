require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const HttpError = require('./util/HttpError');

const AuthRoutes = require('./routes/Auth');
const UserRoutes = require('./routes/User');

// Initializing express app
const app = express();

// Handling cors errors
app.use(cors());

// Extracting json data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes here
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);

// Default=> If no route matches the url
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
})

// Handling error
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'Something went wrong, please try again later.' });
});

// Connecting to database
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        // Starting server
        return app.listen(process.env.PORT);
    })
    .then(server => {
        // consoling result
        console.log('Connected to database and server started at port', process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    });