const webpack = require('webpack');
module.exports = {
    mode: 'development',
    entry: __dirname + "/index.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    devtool: 'none',
    // devServer: {
    //     contentBase: "./public",
    //     historyApiFallback: true,
    //     inline: true,
    //     hot: true
    // },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin()
    ],
};