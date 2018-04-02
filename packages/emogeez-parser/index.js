import Config from 'lib/config/config';
import Store from 'lib/store/store';
import Matcher from 'lib/matcher/matcher';
import Replacer from 'lib/replacer/replacer';

export default (configuration) => {
  const config = Config(configuration);
  const store = Store(config);
  const matcher = Matcher(config, store);
  const replacer = Replacer(config, store);

  return {
    store,
    matcher,
    replacer,
  };
};
