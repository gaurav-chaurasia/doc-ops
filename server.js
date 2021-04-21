// local node modules 
const app = require('./app');
const logger = require('./config/logger').init('MASTER');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];

app.listen(config.PORT, config.HOST, () => {
    logger.info(`🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻`);
    logger.info(``);
    logger.info(`🚩 Server is Running at << http://${config.HOST}:${config.PORT} >>`);
    logger.info(``);
    logger.info(`🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺`);
});