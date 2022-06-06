const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const webpack = require('webpack');

module.exports = {
    stats: "minimal",
    entry: "./src/ts/index.ts",
    optimization: {
        minimize: false
    },
    mode: 'production',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            BASE_API_URL: 'https://pronouns.alejo.io/api/',
            DEBUG: false
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/public", to: "./" },
            ],
        }),
    ],
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src'),
        },
        extensions: [
            ".webpack.js",
            ".web.js",
            ".ts",
            ".js",
            ".css"
        ]
    },
    module: {
        rules: [
            { test: /\.ts$/i, use: [ 'ts-loader' ] },
            { test: /\.scss$/i, use: [ "style-loader", "css-loader", "sass-loader" ] },
        ],
    },
}
