const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin');

const languages = {
    "en": require("./src/i18n/en.json"),
    "pl": require("./src/i18n/pl.json")
};

const defaultLanguage = "en";


module.exports = Object.keys(languages).map((language) => {

    return {

        context: __dirname,
        entry: './src/app/main.js',
        output: {
            path: path.join(__dirname, "dist"),
            filename: 'js/bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.(eot|svg|ttf|woff|woff2|jpe?g|png|gif|svg|pdf)$/,
                    loader: 'file-loader'
                },

                // transform ES6 to ES5
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: true,
                        }
                    }

                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({fallback: "style-loader", use: ["css-loader", "sass-loader"]})
                }
            ]
        },
        plugins: [
            new I18nPlugin(
                languages[language]
            ),
            new CopyWebpackPlugin([
                {from: './src/assets', to: 'assets'},
            ]),

            new ExtractTextPlugin('main.css'),
            new HtmlWebpackPlugin({
                filename: language == defaultLanguage ? 'index.html' : `index-${language}.html`,
                template: "./src/index.html"
            }),
            new HtmlWebpackPlugin({
                filename: language == defaultLanguage ? 'about.html' : `about-${language}.html`,
                template: "./src/about.html"
            })
        ],
    }
})