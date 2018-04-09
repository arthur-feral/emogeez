import Config from 'lib/config/config';
import Http from 'lib/http/http';
import Store from 'lib/store/store';
import Matcher from 'lib/matcher/matcher';
import Replacer from 'lib/replacer/replacer';

export default (configuration) => {
  const config = Config(configuration);
  const http = Http(config);
  const store = Store(config, http);
  const matcher = Matcher(store);
  const replacer = Replacer(store);

  return {
    matcher,
    replacer,
  };
};
