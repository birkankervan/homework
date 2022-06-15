const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.cjs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const hotMiddlewareScript =
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

module.exports = merge(common, {
    mode: 'development',
    context: __dirname,
    entry: { main: ['./src/js/index.js', hotMiddlewareScript] },
    devtool: 'inline-source-map',

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
})
