const nodemailer = require('nodemailer')
const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const logger = require('../config/logger').init('MASTER');


module.exports = {
  transport: null,
  templates: {},
  init() {
    let transportConfig;
    if (process.env.SENDGRID_API_KEY) {
        transportConfig = nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        });
    } else {
        transportConfig = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "gauravk3899@gmail.com", 
                clientId: process.env.MAIL_CLIENT,
                clientSecret: process.env.MAIL_SECRET
            }
        };
    }
    this.transport = nodemailer.createTransport(transportConfig);
    // if () {
    //   logger.warn('Mail is not setup! Please set the configuration in the administration area!')
    //   this.transport = null
    // }
    return this
  },
  async send(opts) {
    if (!this.transport) {
      logger.warn('Cannot send email because mail is not setup in the administration area!')
      throw new Error({ msg: 'mail not configured!!!'});
    }
    await this.loadTemplate(opts.template)
    return this.transport.sendMail({
      from: `gauravk3899@gmail.com`,
      to: opts.to,
      subject: `checkout you document`,
      text: opts.text,
      html: _.get(this.templates, opts.template)({
        logo: opts.picture,
        siteTitle: '123 -check- 123',
        copyright: '&copy; all rights reserved',
        ...opts.data
      })
    })
  },
  async loadTemplate(key="test") {
    if (_.has(this.templates, key)) { return }
    const keyKebab = _.kebabCase(key)
    try {
      const rawTmpl = await fs.readFile(path.join(`templates/${keyKebab}.html`), 'utf8')
      _.set(this.templates, key, _.template(rawTmpl))
    } catch (err) {
      logger.warn(err);
      throw new Error({ msg: 'mail template failed to load'});
    }
  }
}
