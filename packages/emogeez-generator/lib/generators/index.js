import superagent from 'superagent';
import generatorSaga from './saga';

export const saga = function* () {
  yield* generatorSaga(superagent);
};
