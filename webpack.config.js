const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'index_bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            }
        ]
    },
    resolve: { 
        extensions: [".ts",".js"]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload
        port:8888
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'src/index.html'
        })
    ]
}