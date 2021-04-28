const logger = require('../config/logger').init('MASTER');

exports.getHome = (req, res) => {
    res.status(200).render('v1/index', { doc_data: '' });
};
