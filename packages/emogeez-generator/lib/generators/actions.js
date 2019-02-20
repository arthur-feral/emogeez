import {
  GENERATOR_GENERATE_SPRITE_SUCCESS,
  GENERATOR_GENERATE_THEMES_SUCCESS,
} from '../constants';

export const generateThemesSucceeded = () => ({
  type: GENERATOR_GENERATE_THEMES_SUCCESS,
});

export const generateSpriteSucceeded = () => ({
  type: GENERATOR_GENERATE_SPRITE_SUCCESS,
});
