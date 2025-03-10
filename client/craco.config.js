const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Добавляем fallback для Node.js модулей
      webpackConfig.resolve.fallback = {
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        fs: false, // Если fs не нужен, отключите его
        process: require.resolve('process/browser'),
      };

      // Добавляем плагин для поддержки process
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        })
      );

      return webpackConfig;
    },
  },
};
