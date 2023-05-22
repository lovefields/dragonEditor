module.exports = {
    context: __dirname,
    entry: {
        styles: ['./style/index.scss']
    },
    output: {
        filename: './src/core/style/common.css',
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: 'ss-loader?sourceMap!sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true'
            }
        ],
    },
    watch: true
}
