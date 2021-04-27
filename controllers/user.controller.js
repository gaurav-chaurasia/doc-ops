const passport = require('passport');
const validator = require('validator');

const logger = require('../config/logger').init('MASTER');
const User = require('../models/user.model');

//  * GET /login
//  * Login page.
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.status(200).render('v1/account/login');
};
exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.status(200).render('v1/account/signup');
};


//  * GET /logout
//  * Log out.
exports.logout = (req, res) => {
    if (req.session && req.user) {
        req.logout();
        req.flash('danger', { msg: 'You are Successfully logged out!'});
        res.redirect('/');
    } else {
        req.flash('info', { msg: 'You are already logged out!'});
        res.redirect('/');
    }
};


//  * GET /account
//  * Profile page.
exports.getAccount = (req, res) => {
  res.render('account/profile');
};
