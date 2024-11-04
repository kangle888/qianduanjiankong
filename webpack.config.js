const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// user-agent是把浏览器的信息UserAgent变成一个对象
module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    // compress: true,
    // port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head'
    })
  ]
};