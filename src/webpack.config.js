const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const path = require("path");
const commonPath = path.resolve(__dirname, "common");
const name = "dragonEditor";
const webpackMode = "production"; // ['development', 'production']
const viewerName = "dragonEditorViewer";
const scriptFile = [`${commonPath}/js/index.js`];
const styleFile = [`${commonPath}/css/index.scss`];
const viewerStyleFile = [`${commonPath}/css/viewer.scss`];

let options = [
    {
        type: "js",
        name: name,
        output: "dist",
        file: scriptFile,
    },
    {
        type: "css",
        name: name,
        output: "dist",
        file: styleFile,
    },
    {
        type: "css",
        name: viewerName,
        output: "dist",
        file: viewerStyleFile,
    },
];

function getConfig(type, file, name) {
    let config;

    if (type == "js") {
        config = {
            mode: webpackMode,
            entry: {
                common: file,
            },
            target: "web",
            watch: true,
            watchOptions: {
                poll: 500,
            },
        };
    } else {
        config = {
            mode: webpackMode,
            entry: {
                styles: file,
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
    }

    return config;
}

function getModuleList() {
    let arr = [];

    options.forEach((item) => {
        let config = getConfig(item.type, item.file, item.name);
        let folder;

        if (item.type == "js") {
            folder = "../dist";
        } else {
            folder = "../dist/css";
        }

        if (item.type == "js") {
            arr.push(
                Object.assign({}, config, {
                    output: {
                        filename: `js/${item.name}.js`,
                        path: path.resolve(__dirname, folder),
                        library: item.name,
                        libraryTarget: "umd",
                    },
                }),
            );
        } else {
            arr.push(
                Object.assign({}, config, {
                    output: {
                        path: path.resolve(__dirname, folder),
                    },
                }),
            );
        }
    });
    return arr;
}

module.exports = getModuleList();
