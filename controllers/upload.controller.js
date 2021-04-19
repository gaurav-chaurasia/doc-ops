const Logger = require('../config/logger').init('MASTER');

exports.local = (req, res) => {
    Logger.info(`${req.file.filename}`);
    res.status(200).json({ status: true });
};

exports.S3 = (req, res) => {
    //
};
