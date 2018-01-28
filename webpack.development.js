const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const html = new HtmlWebpackPlugin({
  template: 'index.html',
  minify: {
    collapseWhitespace: true,
  },
})

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './js/index.js',
  output: {
    path: path.join(__dirname, 'src', 'www'),
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
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
    ],
  },
  plugins: [html],
}
