const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const commonPath = path.resolve(__dirname, 'common');
const name = "dragonEditor";

let js = [`${commonPath}/js/index.js`];
let css = [`${commonPath}/css/index.scss`];
let file = js.concat(css);

module.exports = {
    mode: "production", //development
    entry: {
        common: file,
    },
    target: "web",
    output: {
        filename: `js/${name}.js`,
        path: path.resolve(__dirname, "../assets"),
        library: name,
        libraryTarget: "umd",
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `css/${name}.css`,
        }),
    ],
    watch: true,
    watchOptions: {
        poll: 1000,
    },
};
