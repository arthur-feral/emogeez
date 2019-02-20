import commander from 'commander';
import {
  forEach,
} from 'lodash';
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import mainSaga from './lib/saga';
import {
  reducer as configReducer,
  saga as configSaga,
} from './lib/config';
import {
  saga as fsSaga,
} from './lib/fs';
import {
  saga as fetcherSaga,
} from './lib/fetcher';
import {
  reducer as collectorReducer,
  middleware as collectorMiddleware,
} from './lib/collector';
import {
  APP_START,
} from './lib/constants';
import { exitApp } from './lib/actions';

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

const sagaMiddleware = createSagaMiddleware({
  onError: (...args) => {
    // eslint-disable-next-line no-console
    console.error('Uncaught error from saga', ...args);
  },
});
const reducers = {
  collector: collectorReducer,
  config: configReducer,
};

const sagas = [
  mainSaga,
  configSaga,
  fsSaga,
  fetcherSaga,
];

const middlewares = [
  thunk,
  sagaMiddleware,
  collectorMiddleware,
];

const store = createStore(
  combineReducers(reducers),
  compose(applyMiddleware(...middlewares)),
);

forEach(
  sagas,
  (saga) => {
    sagaMiddleware.run(saga);
  },
);

store.dispatch({
  type: APP_START,
  payload: commander,
});

process.on('SIGINT', () => {
  store.dispatch(exitApp(1, 'SIGINT'));
});

process.on('uncaughtException', (error) => {
  store.dispatch(exitApp(1, error));
});

process.on('error', (error) => {
  store.dispatch(exitApp(1, error));
});
