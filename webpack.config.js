"use strict";

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
  context: __dirname + '/frontend',

  entry: {
    home: './home.js',
    about: './about.js',
    vendor: 'whatwg-fetch'
  },

  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    library: '[name]'
  },

  watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV === 'development' ? 'cheap-eval-source-map' : 'source-map',

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
          presets: ['env'],
          plugins: ['transform-runtime']
        }
      }
    }],
    noParse: /node_modules\/(whatwg-fetch|moment\/locale)/
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
