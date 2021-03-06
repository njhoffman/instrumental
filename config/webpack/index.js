const _ = require('lodash');
const { argv } = require('yargs');
const webpack = require('webpack');

const initLogger = require('../../shared/logger/terminal');
const initLoader = require('./loaders');
const baseConfig = require('./base.js');
const devConfig = require('./development');
const prodConfig = require('./production');

module.exports = (config) => {
  const { __TEST__, __API_URL__ } = config.globals;
  const logger = initLogger('app:config:webpack');
  logger.info(`API Path Global: ${__API_URL__}`);
  const APP_ENTRY = config.paths.client('app.js');

  const wpConfig = {
    ...baseConfig,
    ...config.webpack,
    module: { rules: initLoader(config) },
    mode: config.env === 'production' ? 'production' : 'development',
    output: { path: config.paths.dist() },
    plugins: [
      new webpack.DefinePlugin(config.globals)
    ],
    externals: []
  };

  wpConfig.entry.app.push(APP_ENTRY);

  // exit on errors during testing so that they do not get skipped and misreported
  if (__TEST__ && !argv.watch) {
    wpConfig.plugins.push(function handleTestingErrors() {
      this.plugin('done', (stats) => {
        if (stats.compilation.errors.length) {
          // pretend no assets were generated, prevents tests from running to make warnings noticeable
          logger.error(stats.compilation.errors);
          throw new Error(stats.compilation.errors.map(err => err.message || err));
        }
      });
    });
    // TODO: Don't split bundles during testing, since we only want import one bundle
  }

  _.merge(wpConfig.externals.webpackVariables, { apiUrl: `${__API_URL__}` });
  const webpackEnv = wpConfig.mode === 'production' ? prodConfig(config) : devConfig(config);

  // const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
  // const smp = new SpeedMeasurePlugin({ outputFormat: 'human' });
  // return smp.wrap(config.webpack);

  _.merge(
    wpConfig,
    webpackEnv,
    { plugins: [].concat(wpConfig.plugins, webpackEnv.plugins) }
  );
  return wpConfig;
};
