import {
  take,
  put,
  fork,
} from 'redux-saga/effects';
import {
  CONFIG_UPDATED,
  APP_READY,
  FS_READY, APP_DONE,
  FETCHER_FETCH_COMPLETE,
} from './constants';
import logger from './logger';

function* appTermination() {
  while (true) {
    const { payload } = yield take(APP_DONE);
    if (payload.code === 1) {
      logger.error(payload.status);
    }

    process.exit(payload.code);
  }
}

export default function* appSaga() {
  logger.info('🙂 App starting...');

  yield fork(appTermination);

  logger.sameLine('⚙️  Configuring app: ♻️');
  yield take(CONFIG_UPDATED);
  logger.success('⚙️  Configuring app: ✅');

  logger.sameLine('💾 Preparing files space: ♻️');
  yield take(FS_READY);
  logger.success('💾 Preparing files space: ✅️');

  yield put({ type: APP_READY });

  logger.sameLine('📡  Collecting data: ♻️');
  yield take(FETCHER_FETCH_COMPLETE);
  logger.success('📡  Collecting data: ✅️');
}
