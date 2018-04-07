import {
  reduce,
  keys,
} from 'lodash';

/**
 * You can add aliases here
 * This is a mapping between an alias as a string for an emoji and the emoji shortname
 * */
const ALIASES_MAP = {
  '<3': 'heart',
  '</3': 'broken-heart',
  ':)': 'slightly-smiling-face',
  '(:': 'slightly-smiling-face',
  ':-)': 'slightly-smiling-face',
  'C:': 'grinning',
  'c:': 'grinning',
  ':D': 'grinning',
  ':-D': 'grinning',
  ';)': 'wink',
  ';-)': 'wink',
  '):': 'slightly-frowning-face',
  ':(': 'slightly-frowning-face',
  ':-(': 'slightly-frowning-face',
  ':\'(': 'cry',
  '=)': 'smiley',
  '=-)': 'smiley',
  ':*': 'kissing',
  ':-*': 'kissing',
  ':>': 'grinning',
  ':->': 'grinning',
  '8)': 'sunglasses',
  ':\\': 'confused',
  ':-\\': 'confused',
  ':/': 'confused',
  ':-/': 'confused',
  ':|': 'neutral-face',
  ':-|': 'neutral-face',
  ':O': 'open-mouth',
  ':-o': 'open-mouth',
  '>:(': 'angry',
  '>:-(': 'angry',
  ':-p': 'stuck-out-tongue',
  ':P': 'stuck-out-tongue',
  ':-P': 'stuck-out-tongue',
  ':-b': 'stuck-out-tongue',
  ';p': 'stuck-out-tongue-winking-eye',
  ';-p': 'stuck-out-tongue-winking-eye',
  ';b': 'stuck-out-tongue-winking-eye',
  ';-b': 'stuck-out-tongue-winking-eye',
  ';P': 'stuck-out-tongue-winking-eye',
  ';-P': 'stuck-out-tongue-winking-eye',
  ':o)': 'monkey-face',
  'D:': 'anguished',
  ':fu:': 'reversed-hand-with-middle-finger-extended',
  xD: 'rolling-on-the-floor-laughing',
};

const aliasesList = keys(ALIASES_MAP);
const aliasesListEscaped = aliasesList
  .map(alias => alias
    .replace('\\', '\\\\')
    .replace(')', '\\)')
    .replace(':', '\\:')
    .replace(';', '\\;')
    .replace('-', '\\-')
    .replace('*', '\\*')
    .replace('|', '\\|')
    .replace('(', '\\(')
    .replace('/', '\\/'),
  );

const ALIASES_REGEXP = new RegExp(`(\\s|^)(${aliasesListEscaped.join('|')})(?:(?=\\s|$))`, 'mg');

module.exports = {
  ALIASES_MAP,
  ALIASES_REGEXP,
};
