const app = require('./app');
const logger = require('./config/logger').init('MASTER');
const chalk = require('chalk');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];

app.listen(config.PORT, config.HOST, () => {
    logger.info(
        `${chalk.green('✓')} Server is Running at << ${chalk.green(
            `http://${config.HOST}:${config.PORT}`,
        )} >>`,
    );
    logger.info('Press CTRL-C to stop');
});
