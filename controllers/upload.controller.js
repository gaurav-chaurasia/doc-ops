const logger = require('../config/logger').init('MASTER');
const axios = require('axios');
const pdf = require('pdf-parse');
const util = require('util');
const fs = require('fs');


exports.local = async (req, res, next) => {
    const FILENAME = req.file.filename;
    const SEARCH_STRING = req.body.search_string;
    const EMAIL = req.body.email;
    const SEARCH_ONLY = req.body.search_only;
    const DETAILED = req.body.detailed;

    let json_data = {};

    let dataBuffer = fs.readFileSync(__dirname + `\\uploads\\${FILENAME}`);

    pdf(dataBuffer)
        .then((data) => {
            
            json_data = {
                info: data.info,
                numpages: data.numpages,
                text: data.text,
            };
            
            res.status(200).json(json_data);
        })
        .catch((err) => {
            return next(err);
        });
};

exports.S3 = (req, res) => {
    //
};
