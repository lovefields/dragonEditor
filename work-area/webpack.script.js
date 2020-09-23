const path = require("path");
const commonPath = path.resolve(__dirname, "common");
const name = "dragonEditor";

module.exports = {
    // ['development', 'production']
    mode: "production",
    entry: {
        common: [`${commonPath}/js/index.js`],
    },
    target: "web",
    output: {
        filename: `js/${name}.js`,
        path: path.resolve(__dirname, "../assets"),
        library: name,
        libraryTarget: "umd",
    },
    watch: true,
    watchOptions: {
        poll: 500,
    },
};
