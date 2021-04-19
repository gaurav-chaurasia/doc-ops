const Logger = require('../config/logger').init('MASTER');

exports.getHome = (req, res) => {
    Logger.info(`check`);
    res.status(200).render('v1/index');
};
