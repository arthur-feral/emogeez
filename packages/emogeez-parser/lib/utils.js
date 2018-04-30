/**
 * format char unicode to something like this
 * "D83D-DC69-200D-2764-FE0F-200D-D83D-DC69"
 * @param char
 * @returns {string}
 */
export const getUnicode = (char) => {// eslint-disable-line
  let i = 0;
  let c = 0;
  let p = 0;
  const r = [];
  while (i < char.length) {
    // eslint-disable-next-line no-plusplus
    c = char.charCodeAt(i++);
    if (p) {
      // eslint-disable-next-line no-bitwise
      r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
      p = 0;
    } else if (c >= 55296 && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join('-');
};
