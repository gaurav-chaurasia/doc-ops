// node modules
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const layout = require('express-ejs-layouts');
const errorHandler = require('errorhandler');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];
const logger = require('./config/logger').init('MASTER');
const log = require('morgan');
const chalk = require('chalk');
require('dotenv').config();

// database connection
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASE_URI, () => {
    logger.info(`${chalk.green('✓')} Database Connection Successful`);
});
mongoose.connection.on('error', (err) => {
    logger.error('Database Connection Error');
    logger.error(err);
    logger.error(`${chalk.red('✗')} MongoDB connection error. Please make sure MongoDB is running`);
    process.exit();
});

app.use(layout);
app.set('layout', './v1/layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(log('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        key: 'doc-ops',
        secret: config.secret,
        store: MongoStore.create({
            mongoUrl: process.env.DATABASE_URI,
        }),
    }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.disable('x-powered-by');
app.use((req, res, next) => {
    if (
        !req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)
    ) {
        req.session.return_to = req.originalUrl;
    } else if (req.user && (req.path === '/account' || req.path.match(/^\/api/))) {
        req.session.return_to = req.originalUrl;
    }
    next();
});

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

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        logger.error(err);
        res.status(500).send('Server Error');
    });
}

module.exports = app;
