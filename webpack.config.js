const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: [
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
                    { loader: 'sass-loader', options: { sourceMap: true } }
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
        })        
    ]
};