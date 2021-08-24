var path = require('path');
var SRC_DIR = path.join(__dirname, './client/src');
var DIST_DIR = path.join(__dirname, '/client/public');

module.exports = {
  entry: `${SRC_DIR}/index.js`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }],
            ],
          },
        },
      },
    ],
  },
};
