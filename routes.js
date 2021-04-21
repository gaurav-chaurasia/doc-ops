const express = require('express');
const router = express.Router();
const multer = require('multer');

const homeController = require('./controllers/home.controller');
const uploadController = require('./controllers/upload.controller');
const opsController = require('./controllers/ops.controller');

// file upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'addons/uploads');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${Date.now()}_${originalname}`);
    },
});
const upload = multer({ storage });

router.get('/', homeController.getHome);
router.post('/upload/doc/local', upload.single('doc_ops'), uploadController.local);
router.post('/upload/doc/S3', uploadController.S3);
router.get('/upload/:filename', opsController.docOpsResponse);

module.exports = router;
