import { CONFIG_UPDATED } from '../constants';

export const configUpdated = config => ({
  type: CONFIG_UPDATED,
  payload: config,
});
