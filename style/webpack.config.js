const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        common: ["../style/index.scss"],
        viewer: ["../style/viewer.scss"]
    },
    output: {
        path: path.resolve(__dirname, "../src/runtime/core/style"),
    },
    mode: "none",
    plugins: [new MiniCssExtractPlugin({ filename: "[name].css" })],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    watch: true,
};
