const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: './src/app/main.js',
    output: {
        path: path.join(__dirname, "dist"),
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
            // transform ES6 to ES5
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({ fallback: "style-loader", use: ["css-loader", "sass-loader"] })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('main.css'),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html',
            template: "./src/about.html"
        })
    ],
}