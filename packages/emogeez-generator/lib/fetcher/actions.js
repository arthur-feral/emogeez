import {
  FETCHER_FETCH_COMPLETE,
  FETCHER_MODIFIERS_FOUND,
} from '../constants';

export const fetchComplete = () => ({
  type: FETCHER_FETCH_COMPLETE,
});

export const modifiersFound = count => ({
  type: FETCHER_MODIFIERS_FOUND,
  payload: {
    count,
  },
});

