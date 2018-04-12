const path = require('path');
const webpack = require('webpack');

// Getting default webpackconfig in storybook
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = function (baseConfig, env) {
  // Generating the default configuration from env
  const config = genDefaultConfig(baseConfig, env);

  config.devtool = '#cheap-source-map';
  const babelLoader = config.module.rules[0];
  babelLoader.query.cacheDirectory = path.resolve('./.storybook/build/cache/babel');

  config.module.rules.push({
    test: /\.scss$/,
    loaders: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('sass-loader')],
    include: [
      path.resolve(__dirname, '../'),
      path.resolve(__dirname, '../node_modules/emogeez-generator/emojis/apple/apple.scss'),
    ],
  });

  // loader to load pure css files
  config.module.rules.push({
    test: /\.css/,
    loaders: [require.resolve('style-loader'), require.resolve('css-loader')],
    include: [path.resolve(__dirname, '../node_modules/storybook-host')],
  });

  return config;
};
