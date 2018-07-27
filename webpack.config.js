const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    },
    resolve: { 
        extensions: [".ts",".js"]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true, 
        historyApiFallback: true, 
        hot: true, 
        https: false,
        noInfo: true, 
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