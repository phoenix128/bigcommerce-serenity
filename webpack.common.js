const { web } = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    LodashPlugin = require('lodash-webpack-plugin'),
    path = require('path'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    webpack = require('webpack');

// Common configuration, with extensions in webpack.dev.js and webpack.prod.js.
module.exports = {
    bail: true,
    context: __dirname,
    entry: {
        main: './assets/js/app.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /(assets\/js|assets\\js|stencil-utils)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['@babel/plugin-syntax-dynamic-import', 'lodash'],
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    loose: true, // Enable "loose" transformations for any plugins in this preset that allow them
                                    modules: false, // Don't transform modules; needed for tree-shaking
                                    useBuiltIns: 'entry',
                                    corejs: '^3.6.5',
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('postcss-import'),
                                    require('tailwindcss'),
                                    require('postcss-nesting'),
                                    require('autoprefixer'),
                                    require('cssnano')
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
    output: {
        chunkFilename: 'theme-bundle.chunk.[name].js',
        filename: 'theme-bundle.[name].js',
        path: path.resolve(__dirname, 'assets/dist'),
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 1024 * 300,
        maxEntrypointSize: 1024 * 300,
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['assets/dist'],
            verbose: false,
            watch: false,
        }),
        new LodashPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/theme.[name].css',
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
        fallback: { url: require.resolve('url/') },
        alias: {

        },
    },
};
