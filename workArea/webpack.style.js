const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const path = require("path");
const commonPath = path.resolve(__dirname, "common");
const name = "dragonEditor";

module.exports = {
    mode: "production", // ['development', 'production']
    entry: {
        styles: [`${commonPath}/css/index.scss`],
    },
    output: {
        path: path.resolve(__dirname, "../assets/css")
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader : MiniCssExtractPlugin.loader,
                        options:{
                            publicPath: ''
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: `${name}.css`,
        }),
    ],
    watch: true,
    watchOptions: {
        poll: 500,
    },
};
