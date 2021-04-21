// node modules
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const layout = require('express-ejs-layouts');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];
const logger = require('./config/logger').init('MASTER');
require('dotenv').config();

mongoose
    .connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        logger.info('Database connection successfull');
    })
    .catch((err) => {
        logger.error('Database connection error:', err);
    });

app.use(layout);
app.set('layout', './v1/layouts/layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// set local variables
app.use((req, res, next) => {
    req.client_ip = req.socket.remoteAddress;

    // for views
    res.locals.client_ip = req.client_ip;
    res.locals.current_user = req.user;
    next();
});

// setting router
app.use(require('./routes'));

module.exports = app;
