const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const path = require("path");
const commonPath = path.resolve(__dirname, "common");
const name = "dragonEditor";
const viewerName = "dragonEditorViewer";
const mode = "production"; // ['development', 'production']

// script config
const scriptFile = [`${commonPath}/js/index.js`];
const scriptConfig = {
    mode: mode,
    entry: {
        common: scriptFile,
    },
    target: "web",
    watch: true,
    watchOptions: {
        poll: 500,
    },
};

// editor css config
const styleFile = [`${commonPath}/css/index.scss`];
const styleConfig = {
    mode: mode,
    entry: {
        styles: styleFile,
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

// viewer css config
const viewerStyleFile = [`${commonPath}/css/viewer.scss`];
const viewerStyleConfig = {
    mode: mode,
    entry: {
        styles: viewerStyleFile,
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
            filename: `${viewerName}.css`,
        }),
    ],
    watch: true,
    watchOptions: {
        poll: 500,
    },
};

let distScript = Object.assign({}, scriptConfig, {
    output: {
        filename: `js/${name}.js`,
        path: path.resolve(__dirname, "../dist"),
        library: name,
        libraryTarget: "umd",
    },
});

let demoScript = Object.assign({}, scriptConfig, {
    output: {
        filename: `js/${name}.js`,
        path: path.resolve(__dirname, "../demo/assets"),
        library: name,
        libraryTarget: "umd",
    },
});

let distStyle = Object.assign({}, styleConfig, {
    output: {
        path: path.resolve(__dirname, "../dist/css"),
    },
});

let demoStyle = Object.assign({}, styleConfig, {
    output: {
        path: path.resolve(__dirname, "../demo/assets/css"),
    },
});

let distViewerStyle = Object.assign({}, viewerStyleConfig, {
    output: {
        path: path.resolve(__dirname, "../dist/css"),
    },
});

let demoViewerStyle = Object.assign({}, viewerStyleConfig, {
    output: {
        path: path.resolve(__dirname, "../demo/assets/css"),
    },
});

module.exports = [distScript, demoScript, distStyle, demoStyle, distViewerStyle, demoViewerStyle];
