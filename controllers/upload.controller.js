const Logger = require('../config/logger').init('MASTER');

exports.local = (req, res) => {
    Logger.info(`${req.file.filename}`);
    res.status(200).json({ filename: req.file.filename });
};

exports.S3 = (req, res) => {
    //
};
