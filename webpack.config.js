var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry:'./src/core/Game.ts',
    output: {
        filename: 'tetris.js',
        libraryTarget: "umd",
		umdNamedDefine: false
    },
    devtool: 'eval-source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    resolve:{
        root: path.resolve('./src'),
        extensions: ['','webpack.js','.ts','.js']
    },
    module:{
        loaders:[
            { 
                test: /\.tsx?$/,
                loader:'ts-loader',
                exclude:/node_modules/
            }
        ]
    }
}