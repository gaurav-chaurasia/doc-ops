const logger = require('../config/logger').init('MASTER');

const sendMail = (settings) => {
    let transportConfig;
    if (process.env.SENDGRID_API_KEY) {
        transportConfig = nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY,
        });
    } else {
        transportConfig = {
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'gauravk3899@gmail.com',
                clientId: process.env.MAIL_CLIENT,
                clientSecret: process.env.MAIL_SECRET,
            },
        };
    }
    let transporter = nodemailer.createTransport(transportConfig);

    return transporter
        .sendMail(settings.mailOptions)
        .then(() => {
            settings.req.flash(settings.successfulType, { msg: settings.successfulMsg });
        })
        .catch((err) => {
            if (err.message === 'self signed certificate in certificate chain') {
                console.log(
                    'WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.',
                );
                transportConfig.tls = transportConfig.tls || {};
                transportConfig.tls.rejectUnauthorized = false;
                transporter = nodemailer.createTransport(transportConfig);
                return transporter.sendMail(settings.mailOptions).then(() => {
                    settings.req.flash(settings.successfulType, { msg: settings.successfulMsg });
                });
            }
            console.log(settings.loggingError, err);
            settings.req.flash(settings.errorType, { msg: settings.errorMsg });
            return err;
        });
};

exports.getHome = (req, res) => {
    res.status(200).render('v1/index');
};
