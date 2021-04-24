// node modules
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const layout = require('express-ejs-layouts');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];
const logger = require('./config/logger').init('MASTER');
const chalk = require('chalk');
require('dotenv').config();

// database connection
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASE_URI);
mongoose.connection.on('error', (err) => {
    logger.error('Database Connection Error');
    logger.error(err);
    logger.error(`${chalk.red('✗')} MongoDB connection error. Please make sure MongoDB is running`);
    process.exit();
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
