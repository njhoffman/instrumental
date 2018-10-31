const fs = require('fs-extra');
const webpack = require('webpack');
const debug = require('debug')('app:bin:compile');
const config = require('../config/');

// Wrapper around webpack to promisify its compiler and supply friendly logging
const webpackCompiler = (webpackConfig) =>
  new Promise((resolve, reject) => {
    const compiler = webpack(config.webpack);
    compiler.run((err, stats) => {
      if (err) {
        debug('Webpack compiler encountered a fatal error.', err);
        return reject(err);
      }

      const jsonStats = stats.toJson();
      debug('Webpack compile completed.');
      debug(stats.toString(config.compiler_stats));

      if (jsonStats.errors.length > 0) {
        debug('Webpack compiler encountered errors.');
        debug(jsonStats.errors.join('\n'));
        return reject(new Error('Webpack compiler encountered errors'));
      } else if (jsonStats.warnings.length > 0) {
        debug('Webpack compiler encountered warnings.');
        debug(jsonStats.warnings.join('\n'));
      } else {
        debug('No errors or warnings encountered.');
      }
      return resolve(jsonStats);
    });
  });

const compile = () => {
  debug('Starting compiler.');
  return Promise.resolve()
    .then(() => webpackCompiler(config.webpack))
    .then(stats => {
      if (stats.warnings.length && config.compiler_fail_on_warning) {
        throw new Error('Config set to fail on warning, exiting with status code "1".');
      }
      debug('Copying static assets to dist folder.');
      fs.copySync(config.paths.public(), config.paths.dist());
    })
    .then(() => {
      debug('Compilation completed successfully.');
    })
    .catch((err) => {
      debug('Compiler encountered an error.', err);
      process.exit(1);
    });
};

compile();
