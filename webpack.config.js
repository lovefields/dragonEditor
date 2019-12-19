const path = require('path');
const glob = require('glob');
const name = 'dragonEditor';

let jsFile = glob.sync(path.resolve(__dirname, 'common/js/deragnEditor/*.js'));

module.exports = {
    mode : 'production',
    entry : {
        'common' : './common/js/deragnEditor/main.js'
    },
    output : {
        filename : `${name}.js`,
        path : path.resolve(__dirname, 'common/js'),
        library : name,
        libraryTarget : 'umd'
    }
}