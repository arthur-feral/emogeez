const path = require('path');

module.exports = function (baseConfig) {
  // Generating the default configuration from env
  const config = { ...baseConfig };

  config.devtool = 'eval-source-map';
  const babelLoader = config.module.rules[0];
  babelLoader.use[0].options.cacheDirectory = path.resolve('./.storybook/build/cache/babel');

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
