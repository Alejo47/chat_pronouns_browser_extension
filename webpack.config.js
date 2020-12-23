const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: "./src/ts/content.ts",
    optimization: {
        minimize: false
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            BASE_API_URL: 'https://pronouns.alejo.io/api/',
            NODE_ENV: 'development',
            DEBUG: false
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/public", to: "./" },
            ],
        }),
    ],
    resolve: {
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
            { test: /\.css$/i, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.ts$/i, use: [ 'ts-loader' ] },
            { test: /\.less$/i, use: [ 
                { loader: "style-loader" },
                { loader: "css-loader" },
                { loader: "less-loader" }
            ] },
        ],
    },
}
