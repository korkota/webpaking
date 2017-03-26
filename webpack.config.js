'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rimraf = require('rimraf');
const path = require('path');
const dir = path.resolve.bind(path, __dirname);

const ROOT = 'frontend';
const ASSETS = 'public/assets/';

module.exports = {
  context: dir(ROOT),

  entry: {
    home: './home.js',
    about: './about.js',
    vendor: ['babel-polyfill/dist/polyfill.min.js', 'whatwg-fetch']
  },

  output: {
    path: dir(ASSETS),
    publicPath: '/webpacking/' + ASSETS,
    filename: addHash('[name].js', 'chunkhash'),
    chunkFilename: addHash('[id].js', 'chunkhash'),
    library: '[name]'
  },

  resolve: {
    extensions: ['.jade', '.js', '.styl', '.css'],
    modules: ['node_modules', 'legacy', dir(ROOT)],
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
      options: { name: addHash('[path][name].[ext]', 'hash:6'), limit: 4096 }
    }],
    noParse: /node_modules\/(whatwg-fetch|babel-polyfill\/dist\/polyfill\.min)/
  },

  plugins: [
    {
      apply: (compiler) => {
        rimraf.sync(compiler.options.output.path);
      }
    },
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
      filename: './home.html',
      chunks: ['manifest', 'vendor', 'common', 'home']
    }),
    new HtmlWebpackPlugin({
      filename: './about.html',
      chunks: ['manifest', 'vendor', 'common', 'about']
    })
  ],

  watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

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
