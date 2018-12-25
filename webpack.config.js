const path = require('path')

module.exports = {
  mode: 'development',
  // entry: './src/main.ts',
  entry: {
    os: './src/apps/main.ts'
  },
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
    port: 3000,
    watchOptions: {
      ignored: [
        '**/src/**/*.js',
        '**/test/**/*',
        '**/node_modules'
      ]
    }
  },
  module: {
    rules: [{
      test: /\.ts?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  }
}
