const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals')
const Dotenv = require('dotenv-webpack');
const DeadCodePlugin = require('webpack-deadcode-plugin');

const isEnvDev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
  mode: isEnvDev ? 'development' : 'production',
  target: 'node',
  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },
  resolve: {
    extensions: ['.js'],
  },
  externals: [nodeExternals()],
  entry: ["regenerator-runtime/runtime", path.resolve('index.js')],
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    chunkFilename: '[name].js',
    filename: '[name].js',
    library: '',
    libraryTarget: 'commonjs-module'
  },
  devtool: 'source-map',
  optimization: {
    usedExports: true,
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          // \\ for Windows, \/ for Mac OS and Linux
          /node_modules[\\\/]core-js/,
          /node_modules[\\\/]webpack[\\\/]buildin/,
        ],
        loader: "babel-loader",
        options: {
          presets: [
            '@babel/preset-env'
          ],
        }
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new DeadCodePlugin({
      patterns: [
        'utils/**/*.js',
        'routes/**/*.js',
        'models/**/*.js',
        'middlewares/**/*.js',
        'i18n/**/*.js',
        'db/**/*.js',
        'controllers/**/.js',
        'config.js',
      ],
      exclude: [
        '**/*.(stories|spec).(js|jsx)',
      ],
    })
  ]
};