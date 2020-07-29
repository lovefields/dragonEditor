const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const commonPath = path.resolve(__dirname, "common");
const name = "dragonEditor";

module.exports = {
    mode: "production", // ['development', 'production']
    entry: {
        common: [`${commonPath}/css/index.scss`],
    },
    output: {
        filename: `js/${name}.js`,
        path: path.resolve(__dirname, "../assets"),
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
        new MiniCssExtractPlugin({
            filename: path.resolve(__dirname, `../assets/css/${name}.css`),
        }),
    ],
    watch: true,
    watchOptions: {
        poll: 500,
    },
};
