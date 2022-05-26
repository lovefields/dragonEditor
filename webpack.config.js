const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const commonPath = path.resolve(__dirname, "resources");
const name = "dragonEditor";
const webpackMode = "production"; // ['development', 'production']
const viewerName = "dragonEditorViewer";
const PACKAGE = require("./package.json");
const bannerText = `${name} ${PACKAGE.version}\n${PACKAGE.description}\nAuthor : ${PACKAGE.author} (https://github.com/lovefields)\nLicense : ${PACKAGE.license}`;

let options = [
    {
        type: "js",
        name: name,
        output: "dist",
        file: [`${commonPath}/js/index.js`],
    },
    {
        type: "css",
        name: name,
        output: "dist",
        file: [`${commonPath}/css/index.scss`],
    },
    {
        type: "css",
        name: viewerName,
        output: "dist",
        file: [`${commonPath}/css/viewer.scss`],
    },
];

function getConfig(type, file, name) {
    let config;

    if (type == "js") {
        config = {
            target: "web",
            plugins: [
                new webpack.BannerPlugin({
                    banner: bannerText,
                }),
            ],
            resolve: {
                extensions: [".js"],
            },
        };
    } else {
        config = {
            resolve: {
                extensions: [".css", ".scss"],
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
                new webpack.BannerPlugin({
                    banner: bannerText,
                }),
            ],
        };
    }

    return Object.assign({}, config, {
        mode: webpackMode,
        entry: {
            common: file,
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                }),
            ],
        },
        watch: true,
        watchOptions: {
            poll: 500,
        },
    });
}

function getModuleList() {
    let arr = [];

    options.forEach((item) => {
        let config = getConfig(item.type, item.file, item.name);
        let folder;

        if (item.type == "js") {
            folder = "dist";
        } else {
            folder = "dist/css";
        }

        if (item.type == "js") {
            arr.push(
                Object.assign({}, config, {
                    output: {
                        filename: `js/${item.name}.js`,
                        path: path.resolve(__dirname, folder),
                        library: "DragonEditor",
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
