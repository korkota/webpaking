"use strict";

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
  context: __dirname + '/frontend',

  entry: {
    home: './home.js',
    about: './about.js',
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

  devtool: NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /ru/),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
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
    }]
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
