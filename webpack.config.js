var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {

  entry: {
    homepage: './src/index.js',
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/dist/',
    filename: 'app.js',
  },
  module: {
    loaders: [

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style","css!autoprefixer-loader?browsers=last 2 version!sass")
      },

      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },

  plugins: [
      new ExtractTextPlugin("app.css")
  ]
};
