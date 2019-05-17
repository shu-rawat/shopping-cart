const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var autoprefixer = require('autoprefixer');
var plugin = require('postcss-flexbugs-fixes');
const SassLintPlugin = require('sass-lint-webpack')

module.exports = {
    entry: [ 
        "whatwg-fetch",     
        "./src/app"
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "main.js",
        chunkFilename: "[id].js"
    },
    module : {
        rules : [
            {
                test: /\.s?[ac]ss$/,
                use: [
                    {   loader:MiniCssExtractPlugin.loader, options: { publicPath: './dist'}},
                    { loader: 'css-loader', options: { url: false, sourceMap: true } },
                    { loader: "postcss-loader", options: { sourceMap: true } } ,                    
                    { loader: 'sass-loader', options: { sourceMap: true } },                                      
                ],
            },          
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.html$/,
                include: [
                    path.resolve(__dirname, 'src/views/shared')
                ],
                loader: "handlebars-loader"
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css"
        }) ,
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({flexbox: "no-2009"})                    
                ]
            }
        })
        // new SassLintPlugin()      
    ]
};