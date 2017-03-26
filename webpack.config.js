'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const dir = path.resolve.bind(path, __dirname);

const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_ROOT_FOLDER = 'frontend';
const BUILD_FOLDER = 'public';
const ASSETS_FOLDER = 'assets';
const BASE64_LIMIT = 4096;

module.exports = {
  context: dir(FRONTEND_ROOT_FOLDER),

  entry: {
    home: './home.js',
    about: './about.js',
    vendor: ['babel-polyfill/dist/polyfill.min.js', 'whatwg-fetch']
  },

  output: {
    path: dir(BUILD_FOLDER, ASSETS_FOLDER),
    publicPath: `/${ASSETS_FOLDER}/`,
    filename: addHash('js/[name].js', 'chunkhash'),
    chunkFilename: addHash('js/[id].js', 'chunkhash'),
    library: '[name]'
  },

  resolve: {
    extensions: ['.jade', '.js', '.styl'],
    modules: ['node_modules', 'legacy', dir(FRONTEND_ROOT_FOLDER)],
    alias: { 'work': 'godwhy/oldschool' }
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      options: { babelrc: false, presets: ['env'] }
    }, {
      test: /legacy\/godwhy\/oldschool\.js$/,
      include: /legacy\//,
      use: [
        { loader: 'imports-loader', options: 'workSettings=>{delay:500}' },
        { loader: 'exports-loader', options: 'Work' }
      ]
    }, {
      test: /\.jade$/,
      loader: 'jade-loader'
    }, {
      test: /\.styl$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'autoprefixer-loader', options: { browsers: 'last 2 versions' } },
        { loader: 'stylus-loader', options: 'resolve url' }
      ]
    }, {
      test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'url-loader',
      options: { name: addHash('[path][name].[ext]', 'hash:6'), limit: BASE64_LIMIT }
    }],
    noParse: /node_modules\/(whatwg-fetch|babel-polyfill\/dist\/polyfill\.min)/
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      delay: 'lodash/delay'
    }),
    new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /ru/),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['about', 'home'],
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      chunks: ['manifest', 'vendor', 'common', 'home']
    }),
    new HtmlWebpackPlugin({
      filename: '../about.html',
      chunks: ['manifest', 'vendor', 'common', 'about']
    })
  ],

  devtool: NODE_ENV === 'development' ? 'cheap-source-map' : 'source-map'
};

if (NODE_ENV === 'production') {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true,
      unsafe: true
    }
  }))
}

function addHash(template, hash) {
  return NODE_ENV === 'development' ? template : template.replace(/\.[^.]+$/, `.[${hash}]$&`);
}
