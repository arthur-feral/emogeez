const { TEMP_FILES_PATH: tempPath } = process.env;

export const ALLOWED_THEMES = [
  'apple',
  'facebook',
  'google',
  'messenger',
  'twitter',
  'whatsapp',
];
export const CURRENT_WORKING_DIRECTORY = process.cwd();
export const TEMP_FILES_PATH = `${CURRENT_WORKING_DIRECTORY}/${tempPath}`;
export const TEMP_IMAGES_PATH = `${TEMP_FILES_PATH}/images/`;
export const TEMP_HTML_PATH = `${TEMP_FILES_PATH}/html/`;
export const TEMP_JSON_PATH = `${TEMP_FILES_PATH}/jsons/`;
export const TEMP_STYLE_PATH = `${TEMP_FILES_PATH}/styles/`;
export const BASE_IMAGE_PATH = `${TEMP_IMAGES_PATH}/base.png`;
export const CONFIG_UPDATED = 'CONFIG_UPDATED';

export const BASE_URL = 'https://emojipedia.org';
export const APP_START = 'APP_START';
export const APP_DONE = 'APP_DONE';
export const APP_READY = 'APP_READY';
export const FS_READY = 'FS_READY';
export const ERROR = 'ERROR';
export const AVAILABLE_PREPROCESSORS = ['sass', 'less'];

export const FETCHER_RETRY_COUNT = 5;
export const FETCHER_FETCH_COMPLETE = 'FETCHER_FETCH_COMPLETE';

export const FETCHER_MODIFIERS_FOUND = 'FETCHER_MODIFIERS_FOUND';

export const PARSER_PARSE_CATEGORIES_SUCCESS = 'PARSER_PARSE_CATEGORIES_SUCCESS';
export const PARSER_PARSE_CATEGORY_SUCCESS = 'PARSER_PARSE_CATEGORY_SUCCESS';
export const PARSER_PARSE_EMOJI_SUCCESS = 'PARSER_PARSE_EMOJI_SUCCESS';
export const PARSER_PARSE_IMAGE_SUCCESS = 'PARSER_PARSE_IMAGE_SUCCESS';
export const PARSER_PARSE_IMAGE_ERROR = 'PARSER_PARSE_IMAGE_ERROR';

export const GENERATOR_GENERATE_SPRITE_SUCCESS = 'GENERATOR_GENERATE_SPRITE_SUCCESS';
export const GENERATOR_GENERATE_THEMES_SUCCESS = 'GENERATOR_GENERATE_THEMES_SUCCESS';

export const DATA_OPTIMIZATION = 'DATA_OPTIMIZATION';
export const DATA_OPTIMIZATION_DONE = 'DATA_OPTIMIZATION_DONE';

export const HTML_CATEGORIES_SELECTOR = 'body div.container div.sidebar div.block:first-child';
export const HTML_EMOJIS_SELECTOR = 'body div.container div.content ul.emoji-list';
export const HTML_EMOJI_SHORTNAMES = 'body div.container div.content article ul.shortcodes li';
export const HTML_EMOJI_MODIFIERS_LIST = 'body div.container div.content article .emoji-list';
export const HTML_EMOJI_THEMES = 'body div.container div.content article section.vendor-list ul li .vendor-rollout-target';
export const DEFAULT_THEMES_URL = 'https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@latest/packages/emogeez-generator/emojis';

export const EXTENTIONS = {
  css: 'css',
  sass: 'scss',
  less: 'less',
};

export const CATEGORIES_ORDER = [
  'people',
  'nature',
  'food-drink',
  'activity',
  'travel-places',
  'objects',
  'symbols',
  'flags',
];
