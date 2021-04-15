// const _ = require('lodash')
const winston = require('winston')

module.exports = {
  loggers: {},
  init(uid) {
    let logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.label({ label: uid }),
        winston.format.timestamp(),
        winston.format.printf(info => `[${info.timestamp}] [${info.label}] [${info.level}]: ${info.message}`)
      )
    })

    // Init Console (default)

    logger.add(new winston.transports.Console({
      level: 'info',
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: true
    }))
    logger.add(new winston.transports.File({
      filename: './logs/combined.log',
      level: 'info',
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: true
    }))

    return logger
  }
}
