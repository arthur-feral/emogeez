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
const loggers = {};

each(loggersTypes, (color, type) => {
  loggers[type] = process.env.NODE_ENV === 'test'
    ? noop
    : function (...args) {
      const [message, ...rest] = args;
      process.stdout.write(`${chalk[color](message)}\n`);
      if (rest && rest.length) {
        console.log(rest); // eslint-disable-line no-console
      }
    };
});

loggers.sameLine = (message) => {
  process.stdout.write(`${chalk.yellow(message)}\r`);
};
/**
 * module for stdout logs
 * it exposes info, warn, error and success methods to log with special color
 * it exposes count method to log some progressing infos
 * @type {{}}
 */
export default loggers;
