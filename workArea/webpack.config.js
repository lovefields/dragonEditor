const path = require("path");
const name = "dragonEditor";

module.exports = {
    mode: "production", //development
    entry: {
        common: "./common/js/deragnEditor/index.js",
    },
    target: "web",
    output: {
        filename: `${name}.min.js`,
        path: path.resolve(__dirname, "../asset"),
        library: name,
        libraryTarget: "umd",
        umdNamedDefine: true,
    },
    watch: true,
    watchOptions: {
        poll: 1000,
    },
};
