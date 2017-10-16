var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

var config = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' }, // when this runs, looks for babel in package.json
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ]
};

//check if building for production
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    //add to plugins array
    new webpack.DefinePlugin({
      'process.env': {
        //set node environment to production
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    //minify all JS
    new webpack.optimize.UglifyJsPlugin()
  )
}

module.exports = config;