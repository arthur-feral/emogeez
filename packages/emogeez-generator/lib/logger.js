import chalk from 'chalk';
import {
  each,
  noop,
} from 'lodash';

const loggersTypes = {
  info: 'yellow',
  warn: 'magenta',
  success: 'green',
  error: 'red',
};
let loggers = {};

each(loggersTypes, (color, type) => {
  loggers[type] = process.env.NODE_ENV === 'test' ?
    noop :
    (message) => {
      process.stdout.write(`${chalk[color](message)}\n`);
    };
});

loggers.count = function (message) {
  process.stdout.write(`${chalk.yellow(message)}\r`);
};

loggers.sameLine = (message) => {

  /*
  Got some
  Maximum call stack size exceeded
  RangeError: Maximum call stack size exceeded
  sometimes
   */
  try {
    process.stdout.write(`${chalk.yellow(message)}\r`);
  } catch (error) {

  }
};
/**
 * module for stdout logs
 * it exposes info, warn, error and success methods to log with special color
 * it exposes count method to log some progressing infos
 * @type {{}}
 */
export default loggers;
