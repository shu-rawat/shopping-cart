const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main:"./src/main",
        slider: "./src/slider",
        cart: "./src/cart/cartController", 
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
        chunkFilename: "[id].js"
    },
    // plugins: [
    //     new MiniCssExtractPlugin({
    //       filename: '[name].scss',
    //       chunkFilename: '[id].css',
    //     }),
    //   ],
    //   module: {
    //     rules: [
    //       {
    //         test: /\.css$/,
    //         use: [MiniCssExtractPlugin.loader, 'style-loader','css-loader','sass-loader'],
    //       },
    //     ],
    //   },

    module : {
        rules : [
            {
                test: /\.s?[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false, sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
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