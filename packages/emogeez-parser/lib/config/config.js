import {
  get,
} from 'lodash';
import {
  DEFAULT_THEME_NAME,
  DEFAULT_THEMES_URL,
} from '../constants';

/**
 *
 * @param {object} config
 * @param {string} version
 * @return {Config}
 */
export default (config, version) => {
  const defaultConfig = {
    blackList: [],
    theme: DEFAULT_THEME_NAME,
    themesUrl: DEFAULT_THEMES_URL.replace('{{version}}', version),
  };

  return {
    blackList: get(config, 'blackList', defaultConfig.blackList),
    theme: get(config, 'theme', defaultConfig.theme),
    themesUrl: get(config, 'themesUrl', defaultConfig.themesUrl),
  };
};
