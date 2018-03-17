'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _config = require('./lib/config/config');

var _config2 = _interopRequireDefault(_config);

var _fetcher = require('./lib/fetcher/fetcher');

var _fetcher2 = _interopRequireDefault(_fetcher);

var _parser = require('./lib/parser/parser');

var _parser2 = _interopRequireDefault(_parser);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _constants = require('./lib/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.stdin.resume();

var emitter = new _eventemitter2.default();

var packagejson = require(process.cwd() + '/package.json');

_commander2.default.version(packagejson.version).usage('[options] [value]').option('-d, --destination [path]', 'Path for generated files').option('-s, --size [size]', 'The sprite\'s height').option('--preproc [preprocessor type]', 'the css preprocessor type (less, sass etc...)').option('-p, --prefix [prefix]', 'The classnames prefix').option('-c, --cache', 'Force cache use (use last cached html and images) Dont use it if you want last released emojis').parse(process.argv);

var config = (0, _config2.default)(_commander2.default, emitter);
var fetcher = (0, _fetcher2.default)(_superagent2.default, config, emitter);
var parser = (0, _parser2.default)(config, emitter);

emitter.emit(_constants.APP_START);

emitter.on(_constants.APP_DONE, function () {
  process.exit(0);
});