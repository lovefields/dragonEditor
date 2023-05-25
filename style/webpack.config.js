const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: "../style/index.scss",
    output: {
        path: path.resolve(__dirname, "../src/core/style")
    },
    mode: "none",
    plugins: [
        new MiniCssExtractPlugin({filename: 'common.css'})
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                exclude: /node_modules/
            }
        ]
    },
    watch: true
}
