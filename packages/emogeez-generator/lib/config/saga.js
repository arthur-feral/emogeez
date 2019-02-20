import {
  take,
  put,
} from 'redux-saga/effects';
import { APP_START } from '../constants';
import configParser from './parser';
import { configUpdated } from './actions';
import { exitApp } from '../actions';

export default function* configSaga() {
  const action = yield take(APP_START);
  try {
    const config = configParser(action.payload);
    yield put(configUpdated(config));
  } catch (e) {
    yield put(exitApp(`⚙️  Error while configuring app ${e.message}`));
  }
}
