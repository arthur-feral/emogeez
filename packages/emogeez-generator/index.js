// process.stdin.resume();

import commander from 'commander';
import superagent from 'superagent';

import EventEmitter from 'eventemitter3';
import logger from './lib/logger';
import Config from './lib/config/config';
import Fetcher from './lib/fetcher/fetcher';
import Parser from './lib/parser/parser';
import Monitor from './lib/monitor/monitor';
import Generators from './lib/generators/generators';
import Collector from './lib/collector/collector';

import {
  APP_START,
  APP_DONE,
} from './lib/constants';

const emitter = new EventEmitter();

const packagejson = require(`${process.cwd()}/package.json`); // eslint-disable-line

commander
  .version(packagejson.version)
  .usage('[options] [value]')
  .option('-d, --destination [path]', 'Path for generated files')
  .option('-t, --themesUrl [path]', 'Url to image sprite in the style file')
  .option('-s, --size [size]', 'The sprite\'s height')
  .option('--preproc [preprocessor type]', 'the css preprocessor type (less, sass etc...)')
  .option('-p, --prefix [prefix]', 'The classnames prefix')
  .option('-c, --cache', 'Force cache use (use last cached html and images) Dont use it if you want last released emojis')
  .parse(process.argv);

const config = Config(commander, emitter);
const fetcher = Fetcher(superagent, config, emitter); // eslint-disable-line no-unused-vars
const parser = Parser(config, emitter); // eslint-disable-line no-unused-vars
const monitor = Monitor(config, emitter); // eslint-disable-line no-unused-vars
const generators = Generators(config, emitter); // eslint-disable-line no-unused-vars
const collector = Collector(config, emitter); // eslint-disable-line no-unused-vars

const stopAndExit = (status, error) => {
  if (error) {
    logger.error(error.message);
    logger.error(error.stack);
  }

  // process.stdin.pause();
  process.exit(status);
};

emitter.emit(APP_START);

emitter.on(APP_DONE, () => {
  stopAndExit(0);
});

process.on('SIGINT', () => {
  stopAndExit(1);
});

process.on('uncaughtException', (error) => {
  stopAndExit(1, error);
});

process.on('error', (error) => {
  stopAndExit(1, error);
});
