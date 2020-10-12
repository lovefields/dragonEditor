const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const path = require("path");
const commonPath = path.resolve(__dirname, "common");
const name = "dragonEditorViewer";

module.exports = {
    mode: "production", // ['development', 'production']
    entry: {
        styles: [`${commonPath}/css/viewer.scss`],
    },
    output: {
        path: path.resolve(__dirname, "../dist/css"),
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
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
