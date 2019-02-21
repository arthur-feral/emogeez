import {
  DATA_OPTIMIZATION,
  DATA_OPTIMIZATION_DONE,
} from '../constants';

export const dataOptimizationDone = (categories, emojis, themedEmojis) => ({
  type: DATA_OPTIMIZATION_DONE,
  payload: {
    categories,
    emojis,
    themedEmojis,
  },
});

export const dataOptimization = () => ({
  type: DATA_OPTIMIZATION,
});
