process.stdin.resume();

import commander from 'commander';
import Config from './lib/config/config';
import EventEmitter from 'eventemitter3';
import {
  APP_START,
  APP_DONE,
} from './lib/constants';

const emitter = new EventEmitter();

const packagejson = require(`${process.cwd()}/package.json`);

commander
  .version(packagejson.version)
  .usage('[options] [value]')
  .option('-d, --destination [path]', 'Path for generated files')
  .option('-s, --size [size]', 'The sprite\'s height')
  .option('--preproc [preprocessor type]', 'the css preprocessor type (less, sass etc...)')
  .option('-p, --prefix [prefix]', 'The classnames prefix')
  .option('-c, --cache', 'Force cache use (use last cached html and images) Dont use it if you want last released emojis')
  .parse(process.argv);

const config = Config(commander, emitter);

emitter.emit(APP_START);

emitter.on(APP_DONE, () => {
  process.exit(0);
});
