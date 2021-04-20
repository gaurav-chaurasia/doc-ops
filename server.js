// local node modules 
const app = require('./app');
const Logger = require('./config/logger').init('MASTER');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];

app.listen(config.PORT, config.HOST, () => {
    Logger.info(`🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻`);
    Logger.info(``);
    Logger.info(`🚩 Server is Running at << http://${config.HOST}:${config.PORT} >>`);
    Logger.info(``);
    Logger.info(`🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺`);
});