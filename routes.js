const express = require("express");
const router  = express.Router();


const homeController   = require('./controllers/home.controller');
const uploadController = require('./controllers/upload.controller'); 


router.get('/', homeController.getHome);
router.post('/upload/doc/local', uploadController.local);
router.post('/upload/doc/S3', uploadController.S3);

module.exports = router;
