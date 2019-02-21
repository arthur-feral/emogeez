import { APP_DONE } from './constants';

export const exitApp = error => ({
  type: APP_DONE,
  payload: {
    code: error ? 1 : 0,
    status: error,
  },
});
