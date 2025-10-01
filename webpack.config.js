const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {

  return {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, '/assets'),
      filename: 'iurop-layout.js'
    },
    devServer: {
      port: 4000
    },
    resolve: {
      extensions: ['.js','.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          type: "assets",
          test: /\.(png|svg|jpg|jpeg|gif)$/i
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'iurop-layout.css'
      })
    ],
    watch: argv.mode === 'production' ? false : true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
  }
}