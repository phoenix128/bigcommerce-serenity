const { merge } = require('webpack-merge'),
    commonConfig = require('./webpack.common.js')
    TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(commonConfig, {
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        emitOnErrors: false,
    },
});
