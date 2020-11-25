const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./src/ts/content.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BASE_API_URL': JSON.stringify("https://pronouns.alejo.io/api/")
        })
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
            { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
            { test: /\.ts$/i, use: ['ts-loader'] },
        ],
    },
}