import {
  each,
  includes,
} from 'lodash';
import logger from '../logger';
import { initialState } from './reducer';
import {
  AVAILABLE_PREPROCESSORS,
} from '../constants';
import Configuration from './Configuration';

export default function configParser(commander) {
  /**
   * default config
   * @name DEFAULT_CONFIG_PARAMS
   * @type {Object}
   */
  const DEFAULT_CONFIG_PARAMS = {
    ...initialState,
  };

  const config = {};
  if (commander.preproc && !includes(AVAILABLE_PREPROCESSORS, commander.preproc)) {
    throw new Error('⚙️  You must provide a correct preprocessor parameter');
  }

  each(DEFAULT_CONFIG_PARAMS, (defaultValue, parameter) => {
    config[parameter] = commander[parameter]
      ? commander[parameter]
      : defaultValue;
    logger.info(`${parameter}: ${config[parameter]}`);
  });

  return new Configuration(config);
}
