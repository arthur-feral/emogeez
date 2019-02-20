import {
  CONFIG_UPDATED,
  DEFAULT_THEMES_URL,
} from '../constants';

export const initialState = {
  destination: 'emojis',
  themesUrl: DEFAULT_THEMES_URL,
  size: 24,
  cache: false,
  prefix: 'emojis',
  preproc: 'sass',
};

export default function configReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CONFIG_UPDATED: {
      return payload;
    }

    default:
      return state;
  }
}
