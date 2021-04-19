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
app.use(express.static(path.join(__dirname, "public")));

// setting router
app.use(ROUTER);

module.exports = app;
