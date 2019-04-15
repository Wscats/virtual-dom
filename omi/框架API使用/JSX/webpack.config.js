const path = require('path');

const config = {
    mode: 'development',
    entry: './src/base.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'base.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
            }
        }]
    }
};

module.exports = config;