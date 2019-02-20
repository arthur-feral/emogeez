const { TEMP_FILES_PATH: tempPath } = process.env;

export const TEMP_FILES_PATH = tempPath;
export const TEMP_IMAGES_PATH = `${tempPath}/images/`;
export const TEMP_HTML_PATH = `${tempPath}/html/`;
export const TEMP_JSON_PATH = `${tempPath}/jsons/`;
export const TEMP_STYLE_PATH = `${tempPath}/styles/`;
export const BASE_IMAGE_PATH = `${TEMP_IMAGES_PATH}/base.png`;
export const CURRENT_WORKING_DIRECTORY = process.cwd();
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

export const FETCHER_FETCH_CATEGORIES_ERROR = 'FETCHER_FETCH_CATEGORIES_ERROR';
export const FETCHER_FETCH_CATEGORIES_SUCCESS = 'FETCHER_FETCH_CATEGORIES_SUCCESS';
export const FETCHER_FETCH_CATEGORY_ERROR = 'FETCHER_FETCH_CATEGORY_ERROR';
export const FETCHER_FETCH_CATEGORY_SUCCESS = 'FETCHER_FETCH_CATEGORY_SUCCESS';
export const FETCHER_FETCH_EMOJI_ERROR = 'FETCHER_FETCH_EMOJI_ERROR';
export const FETCHER_FETCH_EMOJI_SUCCESS = 'FETCHER_FETCH_EMOJI_SUCCESS';
export const FETCHER_FETCH_IMAGE_ERROR = 'FETCHER_FETCH_IMAGE_ERROR';
export const FETCHER_FETCH_IMAGE_SUCCESS = 'FETCHER_FETCH_IMAGE_SUCCESS';
export const FETCHER_MODIFIERS_FOUND = 'FETCHER_MODIFIERS_FOUND';
export const FETCHER_IMAGES_FOUND = 'FETCHER_IMAGES_FOUND';

export const PARSER_PARSE_CATEGORIES_ERROR = 'PARSER_PARSE_CATEGORIES_ERROR';
export const PARSER_PARSE_CATEGORIES_SUCCESS = 'PARSER_PARSE_CATEGORIES_SUCCESS';
export const PARSER_PARSE_CATEGORY_ERROR = 'PARSER_PARSE_CATEGORY_ERROR';
export const PARSER_PARSE_CATEGORY_SUCCESS = 'PARSER_PARSE_CATEGORY_SUCCESS';
export const PARSER_PARSE_EMOJI_ERROR = 'PARSER_PARSE_EMOJI_ERROR';
export const PARSER_PARSE_EMOJI_SUCCESS = 'PARSER_PARSE_EMOJI_SUCCESS';
export const PARSER_PARSE_IMAGE_SUCCESS = 'PARSER_PARSE_IMAGE_SUCCESS';
export const PARSER_PARSE_IMAGE_ERROR = 'PARSER_PARSE_IMAGE_ERROR';
export const PARSER_FOUND_MODIFIERS = 'PARSER_FOUND_MODIFIERS';
export const PARSER_FOUND_THEME = 'PARSER_FOUND_THEME';
export const PARSER_PARSED_ALL_IMAGES = 'PARSER_PARSED_ALL_IMAGES';

export const COLLECTOR_COLLECT_DONE = 'COLLECTOR_COLLECT_DONE';

export const GENERATOR_GENERATE_SPRITE_SUCCESS = 'GENERATOR_GENERATE_SPRITE_SUCCESS';
export const GENERATOR_GENERATE_SPRITE_ERROR = 'GENERATOR_GENERATE_SPRITE_ERROR';
export const GENERATOR_GENERATE_STYLE_SUCCESS = 'GENERATOR_GENERATE_STYLE_SUCCESS';
export const GENERATOR_GENERATE_STYLE_ERROR = 'GENERATOR_GENERATE_STYLE_ERROR';
export const GENERATOR_GENERATE_THEMES_SUCCESS = 'GENERATOR_GENERATE_THEMES_SUCCESS';
export const GENERATOR_GENERATE_THEMES_ERROR = 'GENERATOR_GENERATE_THEMES_ERROR';

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
