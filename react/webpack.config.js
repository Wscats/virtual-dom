const path = require('path');

const config = {
    entry: './src/base_test.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                // options: {
                //     "plugins": ["transform-react-jsx"]// 如果需要配置参数注释这条，在 .babelrc上面配置
                // }
            }
        }]
    }
};

module.exports = config;