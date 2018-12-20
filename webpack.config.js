const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  // entry: {
  //   core: './src/core.js'
  // },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js'
    ],
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./src')
    ]
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000
  },
  module: {
    rules: [{
      test: /\.ts?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  }
}
