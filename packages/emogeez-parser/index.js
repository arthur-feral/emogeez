import Config from './lib/config/config';
import Http from './lib/http/http';
import Store from './lib/store/store';
import Matcher from './lib/matcher/matcher';
import Replacer from './lib/replacer/replacer';

export default (configuration) => {
  const { version } = require('./version.json');
  const config = Config(configuration, version);
  const http = Http(config);
  const store = Store(config, http);
  const matcher = Matcher(store);
  const replacer = Replacer(store);

  return {
    store,
    matcher,
    replacer,
  };
};
