// node modules
const express = require('express');
const app = express();
const path = require('path');
const layout = require('express-ejs-layouts');

// local node modules
const ROUTER = require('./routes');

app.use(layout);
app.set('layout', './v1/layouts/layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// ----------------------------------------
// set local variables
// ----------------------------------------
app.use((req, res, next) => {
    req.client_ip = req.connection.remoteAddress;
    
    // for views
    res.locals.client_ip = req.client_ip;
    res.locals.current_user = req.user;
    next();
});

// setting router
app.use(ROUTER);

module.exports = app;
