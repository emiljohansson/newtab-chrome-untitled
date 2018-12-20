const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  // entry: {
  //   core: './src/core.js'
  // },
  resolve: {
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./src')
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    // loaders: [{
    //   test: /\.js$/,
    //   exclude: /node_modules/,
    //   loader: 'babel-loader',
    //   options: {
    //     presets: ['env'],
    //     plugins: [require('babel-plugin-transform-object-rest-spread')]
    //   }
    // }]
  }
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({
  //     name: 'common'
  //   })
  // ]
}
