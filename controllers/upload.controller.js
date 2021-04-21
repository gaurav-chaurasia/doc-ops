const logger = require('../config/logger').init('MASTER');

exports.local = (req, res) => {
    logger.info(`${req.file.filename}`);
    res.status(200).json({ filename: req.file.filename });
};

exports.S3 = (req, res) => {
    //
};
