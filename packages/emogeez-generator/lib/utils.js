import fs from 'fs-extra';

/**
 * format char unicode to something like this
 * "D83D-DC69-200D-2764-FE0F-200D-D83D-DC69"
 * @param char
 * @returns {string}
 */
export const getUnicode = (char) => {
  let i = 0, c = 0, p = 0, r = [];
  while (i < char.length) {
    c = char.charCodeAt(i++);
    if (p) {
      r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
      p = 0;
    } else if (55296 <= c && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join('-');
};

/**
 * save a file on a specified path
 * @param content
 * @param path
 * @param name
 */
export const saveFile = (content, path, name) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    fs.accessSync(path, fs.F_OK);
  } catch (error) {
    fs.mkdirpSync(path);
  }

  fs.writeFileSync(`${path}/${name}`, content);
};
