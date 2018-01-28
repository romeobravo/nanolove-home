const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'main.css',
})

const html = new HtmlWebpackPlugin({
  template: 'index.html',
  minify: {
    collapseWhitespace: true,
  },
})

const copy = new CopyWebpackPlugin([{ from: 'public' }])

const uglify = new UglifyJsPlugin()

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './js/index.js',
  output: {
    path: path.join(__dirname, '.build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
    ],
  },
  plugins: [extractSass, html, copy, uglify],
}
