const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const common = require('./webpack.config.common.js');
const paths = require('./paths');

module.exports = merge(common, {
  // Providing the mode configuration option tells webpack to use its
  // built-in optimizations accordingly
  mode: 'production',

  // Controls if and how source maps are generated.
  devtool: 'source-map',

  // Output single file into the dist directory
  output: {
    path: paths.build,
    filename: '[name].[contenthash].bundle.js'
  },

  module: {
    rules: [
      // MiniCssExtractPlugin.loader - extracts CSS into separate files.
      // css-loader - Interpret @import and url() and resolve them.
      // postcss-loader - Process CSS.
      // sass-loader - Loads a Sass/SCSS file and compiles it to CSS.
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
              // sourceMap: false,
              // modules: false
            }
          },
          'postcss-loader',
          'sass-loader']
      }
    ]
  },

  plugins: [
    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: '[id].css'
    })
  ],

  // Since version 4 webpack runs optimizations for you depending on the chosen mode,
  // still all optimizations are available for manual configuration and overrides.
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        extractComments: true
      }),
      new CssMinimizerPlugin()
    ],
    runtimeChunk: {
      name: 'runtime'
    }
  }
});
