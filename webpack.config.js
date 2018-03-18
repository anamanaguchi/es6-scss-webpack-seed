const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');

const htmlConfig = [];
class customFileWatcher{
    constructor ({files = []} = {}) {
        this.files = files
    }

    apply(compiler){
        compiler.plugin('compile', (compilation, callback) => {
            console.log(compilation)
            const filesFound = []
            this.files.map(pattern => {
              if (pattern.substr(0, 1) !== '!') {
                glob.sync(pattern, this.globOptions)
                  .map(file => filesFound.push(file))
              }
            })
      
            console.log(filesFound);
            if (this.verbose && !this.filesAlreadyAdded) {
              console.log('Additional files watched : ', JSON.stringify(files, null, 2))
            }
            
            filesFound.map(file => compilation.compilationDependencies.push(file))
      
            //this.filesAlreadyAdded = true
            //callback()
        });
    }
}

module.exports = function(){
    const i18n = {
        defaultLang: 'en',
        languages: {
            pl: require(path.join(__dirname, "src", "i18n", 'pl.js')),
            en: require(path.join(__dirname, "src", "i18n", 'en.js'))
        }
    }
    
    return {
        context: __dirname,
        entry: ['./src/app/main.js'],
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
                {
                    test: /\.hbs$/,
                    loader: 'handlebars-loader',
                    query: { 
                        helperDirs: [path.join(__dirname, "src", "helpers")],
                        handlebarsLoader: {
                            helperResolver: function(helper, callback){
                                
                            }
                        }
                    }
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
            new customFileWatcher({files: [
                './src/i18n/*.js']
            }),
            new CopyWebpackPlugin([
                {from: './src/assets', to: 'assets'},
            ]),
            new HtmlWebpackPlugin({
                template: 'src/index.hbs',
                translation:  i18n.languages.pl
            }),
            new HtmlWebpackPlugin({
                filename: 'about.html', 
                template: 'src/about.hbs',
                translation:  i18n.languages.pl
            }),
            new ExtractTextPlugin('main.css')
        ],
    }
}