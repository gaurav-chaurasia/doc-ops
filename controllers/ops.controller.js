const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const path = require('path');
const { spawn } = require('child_process');

// in case you have not add python to env variable
const PYTHON_EXECUTABLE_PATH = config.PYTHON_EXECUTABLE_PATH;
const PYTHON_SCRIPT_PATH = path.join(__dirname, '../addons/python/script.py');
// runner for script
function run_script(executable, path, params) {
    return spawn(executable, [path, params]);
}


exports.docOpsResponse = (req, res, next) => {
    const FILENAME = req.params.filename;

    let json_data = [];
    /**
     * @params {string} python executable
     * @params {string} python script path
     * @params {string} doc path
     */
    const python = run_script(PYTHON_EXECUTABLE_PATH, PYTHON_SCRIPT_PATH, FILENAME);

    python.stdout.on('data', (data) => {
        json_data.push(data);
    });

    python.on('close', (code) => {
        console.log(json_data.join(''));
        res.status(200).send(json_data.join(''));
    });
};
