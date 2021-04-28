const logger = require('../config/logger').init('MASTER');
const axios = require('axios');
const pdf = require('pdf-parse');
const util = require('util');
const fs = require('fs');
const Document = require('../models/document.model');


// default render callback
function render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false
    }
 
    return pageData.getTextContent(render_options)
    .then(function(textContent) {
        let lastY, text = '';
        for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY){
                text += item.str;
            }  
            else{
                text += '\n' + item.str;
            }    
            lastY = item.transform[5];
        }
        return text;
    });
}
 
let options = {
    pagerender: render_page
}


exports.local = async (req, res, next) => {
    try {
        const FILENAME = req.file.filename;
        const doc = await Document.create({
            user: req.user,
            name: req.file.filename,
            client_ip: req.client_ip,
        });

        res.redirect(`/api/ope/${FILENAME}`);
    } catch(err) {
        return next(err);
    }
};

exports.S3 = (req, res) => {
    //
};

exports.getAfterDocPostLoggedIn = async (req, res) => {
    try {
        const doc_names = await Document.find({ user: req.user }, { _id: 0, name: 1});
        res.render('v1/index_loggedin', { doc_data: '', doc_names: doc_names });
    } catch (err) {
        return next(err);
    }
};
exports.afterDocPostLoggedIn = async (req, res, next) => {
    const FILENAME = req.body.doc_name;
    const doc_names = await Document.find({ user: req.user }, { _id: 0, name: 1 });

    let SEARCH_STRING = req.body.search_string.toLocaleLowerCase().trim();
    SEARCH_STRING = SEARCH_STRING.replace(/  +/g, ' ');

    const EMAIL = req.body.email;
    const SEARCH_ONLY = req.body.search_only;
    const DETAILED = req.body.detailed;
    let json_data = {};

    if (fs.existsSync(__dirname + `\\uploads\\${FILENAME}`) == false) {
        req.flash('warning', [
            { msg: 'File does not exits' },
            { msg: 'Goto home page and upload the file again to continue!!' },
        ]);
        return res.status(200).render('v1/index_loggedin', { doc_data: '', doc_names: doc_names });
    }

    let dataBuffer = fs.readFileSync(__dirname + `\\uploads\\${FILENAME}`);

    pdf(dataBuffer, options)
        .then((data) => {
            let RAW_TEXT = data.text.toLocaleLowerCase().trim();
            RAW_TEXT = RAW_TEXT.replace(/  +/g, ' ');
            // console.log(data.text);
            // console.log(data.text.length);

            // for count of string
            let substring_count;
            let substring_containing_serch;
            let substring_found_status = false;
            let loc = RAW_TEXT.indexOf(SEARCH_STRING);
            console.log(SEARCH_STRING);
            console.log(loc);
            console.log(RAW_TEXT);
            if (loc > -1) {
                substring_count = (RAW_TEXT.match(new RegExp(SEARCH_STRING, 'gi')) || [])
                    .length;
                substring_found_status = true;
                substring_containing_serch = RAW_TEXT.substring(
                    Math.max(0, loc - 250),
                    Math.min(RAW_TEXT.length, loc + SEARCH_STRING.length + 250),
                );
            }

            let result = data.text.toLocaleLowerCase().trim().split(/[\n,\n\n,?,.]/);
            let result_final = [];
            for (let i = 0; i < result.length; i++) {
                result_final = result_final.concat(result[i].split(' '));
            }

            result_final = result_final.filter((v) => v !== '');
            var count_dict = {};
            for (let i in result_final)
                count_dict[result_final[i]] = count_dict[result_final[i]]
                    ? count_dict[result_final[i]] + 1
                    : 1;

            // [[count, word], [], [] ...]
            let word_arr_for_sort = [];
            for (let i in count_dict) 
                word_arr_for_sort.push([count_dict[i], i]);

            word_arr_for_sort.sort(function (a, b) {
                return b[0] - a[0];
            });

            // for(let i in word_arr_for_sort) {
            //     // console.log(word_arr_for_sort[i][0]);
            //     // console.log(word_arr_for_sort[i][1]);
            // }
            // console.log(word_arr_for_sort);
            // console.log('result_final');
            // console.log(result_final);
            // console.log('result_final');
            // console.log(count_dict);

            json_data = {
                found: substring_found_status,
                count: substring_count,
                search_string: SEARCH_STRING,
                local_text: substring_containing_serch,
                word_count: word_arr_for_sort,
                all_words: result_final,
                popular_word: word_arr_for_sort.slice(0, 10),
                info: data.info,
                numpages: data.numpages,
                text: data.text,
            };
            res.status(200).render('v1/index_loggedin', {
                doc_data: json_data,
                doc_names: doc_names,
            });
        })
        .catch((err) => {
            return next(err);
        });
};


exports.getAfterDocPostLoggedOut = (req, res) => {
    res.status(200).render('v1/index_loggedout', { action: req.url, doc_data: '' });
};
exports.afterDocPostLoggedOut = (req, res, next) => {
    const FILENAME = req.params.filename;

    let SEARCH_STRING = req.body.search_string.toLocaleLowerCase().trim();
    SEARCH_STRING = SEARCH_STRING.replace(/  +/g, ' ');

    const EMAIL = req.body.email;
    const SEARCH_ONLY = req.body.search_only;
    const DETAILED = req.body.detailed;
    let json_data = {};
    
    if (fs.existsSync(__dirname + `\\uploads\\${FILENAME}`) == false) {
        req.flash('warning', [{ msg: 'File does not exits' }, { msg: 'Goto home page and upload the file again to continue!!'}]);
        return res.status(200).render('v1/index_loggedout', { action: req.url, doc_data: '' });
    }

    let dataBuffer = fs.readFileSync(__dirname + `\\uploads\\${FILENAME}`);

    pdf(dataBuffer, options)
        .then((data) => {
            let RAW_TEXT = data.text.toLocaleLowerCase().trim();
            RAW_TEXT = RAW_TEXT.replace(/  +/g, ' ');

            // for count of string
            let substring_count;
            let substring_containing_serch;
            let substring_found_status = false;
            let loc = RAW_TEXT.indexOf(SEARCH_STRING);

            if (loc > -1) {
                substring_count = (RAW_TEXT.match(new RegExp(SEARCH_STRING, 'gi')) || []).length;
                substring_found_status = true;
                substring_containing_serch = RAW_TEXT.substring(
                    Math.max(0, loc - 250),
                    Math.min(RAW_TEXT.length, loc + SEARCH_STRING.length + 250),
                );
            }

            let result = data.text
                .toLocaleLowerCase()
                .trim()
                .split(/[\n,\n\n,?,.]/);
            let result_final = [];
            for (let i = 0; i < result.length; i++) {
                result_final = result_final.concat(result[i].split(' '));
            }

            result_final = result_final.filter((v) => v !== '');
            var count_dict = {};
            for (let i in result_final)
                count_dict[result_final[i]] = count_dict[result_final[i]]
                    ? count_dict[result_final[i]] + 1
                    : 1;

            // [[count, word], [], [] ...]
            let word_arr_for_sort = [];
            for (let i in count_dict) word_arr_for_sort.push([count_dict[i], i]);

            word_arr_for_sort.sort(function (a, b) {
                return b[0] - a[0];
            });

            // console.log(SEARCH_STRING);
            // console.log(RAW_TEXT);
            // console.log(result_final);
            json_data = {
                found: substring_found_status,
                count: substring_count,
                search_string: SEARCH_STRING,
                local_text: substring_containing_serch,
                word_count: word_arr_for_sort,
                all_words: result_final,
                popular_word: word_arr_for_sort.slice(0, 10),
                info: data.info,
                numpages: data.numpages,
                text: data.text,
            };
            res.status(200).render('v1/index_loggedout', { action: req.url, doc_data: json_data });
        })
        .catch((err) => {
            return next(err);
        });
};