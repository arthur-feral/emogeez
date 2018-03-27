import {
  forEach,
} from 'lodash';

export default (config, emojisData) => {
  const blackList = config.blackList || [];
  let emojis = {};
  let codePoints = [];
  let codePointEmoji = {};

  forEach(emojisData, (category) => {
    forEach(category.emojis, (emoji) => {
      if (blackList.indexOf(emoji.name) === -1) {
        emojis = {
          ...emojis,
          [emoji.name]: emoji,
        };

        codePointEmoji = {
          ...codePointEmoji,
          [emoji.unicode]: emoji.name,
        };

        codePoints.push(emoji.unicode);

        forEach(emoji.modifiers, (modifier) => {
          emojis = {
            ...emojis,
            [modifier.name]: modifier,
          };

          codePointEmoji = {
            ...codePointEmoji,
            [modifier.unicode]: modifier.name,
          };

          codePoints.push(modifier.unicode);
        });
      }
    });
  });

  return {
    emojis,
    codePoints,
    codePointEmoji,
  };
};
