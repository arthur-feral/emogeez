import superagent from 'superagent';
import fetcherSaga from './saga';

export const saga = function* () {
  yield* fetcherSaga(superagent);
};
