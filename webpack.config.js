const path = require('path');
const name = 'dragonEditor';

module.exports = {
    mode : 'development', //production
    entry : {
        'common' : './common/js/deragnEditor/index.js'
    },
    target : 'web',
    output : {
        filename : `${name}.min.js`,
        path : path.resolve(__dirname, 'common/js'),
        library : name,
        libraryTarget : 'umd',
        umdNamedDefine : true
    }
}