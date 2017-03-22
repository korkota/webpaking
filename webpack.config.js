'use strict';

const path = require('path');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_ROOT = 'frontend';

const dir = path.resolve.bind(path, __dirname);

module.exports = {
  context: dir(APP_ROOT),

  entry: {
    home: './home.js',
    about: './about.js',
    vendor: ['babel-polyfill/dist/polyfill.min.js', 'whatwg-fetch']
  },

  output: {
    path: dir('public'),
    filename: '[name].js',
    library: '[name]'
  },

  watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV === 'development' ? 'cheap-source-map' : 'source-map',

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
    })
  ],

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: ['env']
        }
      }
    }, {
      test: /legacy\/godwhy\/oldschool\.js$/,
      use: [
        {
          loader: 'imports-loader',
          options: 'workSettings=>{delay:500}'
        }, {
          loader: 'exports-loader',
          options: 'Work'
        }
      ]
    }],
    noParse: /node_modules\/(whatwg-fetch|moment\/locale|babel-polyfill\/dist\/polyfill\.min)/
  },

  resolve: {
    modules: ['node_modules', 'legacy', dir(APP_ROOT)],
    alias: {
      'work': 'godwhy/oldschool'
    }
  }
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
