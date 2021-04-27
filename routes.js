const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');

const homeController = require('./controllers/home.controller');
const uploadController = require('./controllers/upload.controller');
const userController = require('./controllers/user.controller');
const opsController = require('./controllers/ops.controller');
const { is_authenticated } = require('./config/passport');
require('./config/passport');
// file upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'addons/python');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${Date.now()}_${originalname}`);
    },
});
const upload = multer({ storage });

router.get('/', homeController.getHome);
router.get('/hrms', homeController.getHome);

router.get('/login', userController.getLogin);
router.get('/signup', userController.getSignup);
router.get('/logout', userController.logout);
// router.post('/login', userController.postLogin);
// router.post('/signup', userController.postSignup);

router.post('/api/upload/doc/local', upload.single('doc_ops'), uploadController.local);
router.post('/api/upload/doc/S3', uploadController.S3);

router.get('/api/upload/:filename', opsController.docOpsResponse);


router.get('/auth/success', is_authenticated, (req, res, next) => {
    req.flash('success', { msg: `Successfully authenticated using OAuth Accounts`});
    res.redirect('/');
});
router.get('/auth/failure', is_authenticated, (req, res, next) => {
    req.flash('danger', { msg: 'Somthing went wrong, authentication failed!'});
    res.redirect('/');
});
router.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']}),
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure',
    }),
);

module.exports = router;
