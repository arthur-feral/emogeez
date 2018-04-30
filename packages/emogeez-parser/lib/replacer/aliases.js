import {
  keys,
} from 'lodash';

/**
 * You can add aliases here
 * This is a mapping between an alias as a string for an emoji and the emoji shortname
 * */
const ALIASES_MAP = {
  '<3': 'heavy-black-heart',
  '</3': 'broken-heart',
  ':)': 'slightly-smiling-face',
  '(:': 'slightly-smiling-face',
  ':-)': 'slightly-smiling-face',
  'C:': 'grinning-face',
  'c:': 'grinning-face',
  ':D': 'grinning-face',
  ':-D': 'grinning-face',
  ';)': 'winking-face',
  ';-)': 'winking-face',
  '):': 'slightly-frowning-face',
  ':(': 'slightly-frowning-face',
  ':-(': 'slightly-frowning-face',
  ':\'(': 'crying-face',
  '=)': 'smiling-face-with-open-mouth',
  '=-)': 'smiling-face-with-open-mouth',
  ':*': 'kissing-face',
  ':-*': 'kissing-face',
  ':>': 'grinning-face',
  ':->': 'grinning-face',
  '8)': 'smiling-face-with-sunglasses',
  ':\\': 'confused-face',
  ':-\\': 'confused-face',
  ':/': 'confused-face',
  ':-/': 'confused-face',
  ':|': 'neutral-face',
  ':-|': 'neutral-face',
  ':O': 'face-with-open-mouth',
  ':-o': 'face-with-open-mouth',
  '>:(': 'angry-face',
  '>:-(': 'angry-face',
  ':-p': 'face-with-stuck-out-tongue',
  ':P': 'face-with-stuck-out-tongue',
  ':-P': 'face-with-stuck-out-tongue',
  ':-b': 'face-with-stuck-out-tongue',
  ';p': 'face-with-stuck-out-tongue-and-winking-eye',
  ';-p': 'face-with-stuck-out-tongue-and-winking-eye',
  ';b': 'face-with-stuck-out-tongue-and-winking-eye',
  ';-b': 'face-with-stuck-out-tongue-and-winking-eye',
  ';P': 'face-with-stuck-out-tongue-and-winking-eye',
  ';-P': 'face-with-stuck-out-tongue-and-winking-eye',
  ':o)': 'monkey-face',
  'D:': 'anguished-face',
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
