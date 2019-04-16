const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const APP_PATH = path.resolve(__dirname, 'src');
const APP_FILE = path.resolve(__dirname, 'demo/index.js');
const BUILD_PATH = path.resolve(__dirname, 'build');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './demo/index.html',
    filename: 'index.html',
    inject: true,
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
    }
});

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        bundle: [
            APP_FILE
        ]
    },
    output: {
        path: BUILD_PATH,
        filename: '[name][hash].js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader'],
            include: [APP_PATH]
        }]
    },
    plugins: [
        HTMLWebpackPluginConfig,
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:8081' })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
}
