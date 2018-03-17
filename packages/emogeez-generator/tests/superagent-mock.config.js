import fs from 'fs-extra';

const index = fs.readFileSync(`${__dirname}/html/index.html`, 'utf8');
const people = fs.readFileSync(`${__dirname}/html/people.html`, 'utf8');
const fatherChristmas = fs.readFileSync(`${__dirname}/html/father-christmas.html`, 'utf8');
const fatherChristmas12 = fs.readFileSync(`${__dirname}/html/father-christmas-type-1-2.html`, 'utf8');
const fatherChristmas3 = fs.readFileSync(`${__dirname}/html/father-christmas-type-3.html`, 'utf8');
const fatherChristmas4 = fs.readFileSync(`${__dirname}/html/father-christmas-type-4.html`, 'utf8');
const fatherChristmas5 = fs.readFileSync(`${__dirname}/html/father-christmas-type-5.html`, 'utf8');
const fatherChristmas6 = fs.readFileSync(`${__dirname}/html/father-christmas-type-6.html`, 'utf8');
const winkingFace = fs.readFileSync(`${__dirname}/html/winking-face.html`, 'utf8');
const grinningFace = fs.readFileSync(`${__dirname}/html/grinning-face.html`, 'utf8');

module.exports = [
  {
    /**
     * regular expression of URL
     */
    pattern: 'https?://emojipedia.org(/[a-z0-9\-]+/)?',

    /**
     * returns the data
     *
     * @param match array Result of the resolution of the regular expression
     */
    fixtures: function (match) {
      if (match[1] === '/people/') {
        return people;
      }

      if (match[1] === '/grinning-face/') {
        return grinningFace;
      }

      if (match[1] === '/winking-face/') {
        return winkingFace;
      }

      if (match[1] === '/father-christmas/') {
        return fatherChristmas;
      }

      if (match[1] === '/father-christmas-type-1-2/') {
        return fatherChristmas12;
      }

      if (match[1] === '/father-christmas-type-3/') {
        return fatherChristmas3;
      }

      if (match[1] === '/father-christmas-type-4/') {
        return fatherChristmas4;
      }

      if (match[1] === '/father-christmas-type-5/') {
        return fatherChristmas5;
      }

      if (match[1] === '/father-christmas-type-6/') {
        return fatherChristmas6;
      }

      return index;
    },

    /**
     * returns the result of the GET request
     *
     * @param match array Result of the resolution of the regular expression
     * @param data  mixed Data returns by `fixtures` attribute
     */
    get: function (match, data) {
      return {
        text: data,
      };
    },
  },
  {
    //pattern: 'https://emojipedia-us.s3.amazonaws.com/[a-zA-Z0-9\/-]+.png',
    pattern: 'https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/118/grinning-face_1f600.png',
    fixtures: function (match) {
      return fs.readFileSync(`${__dirname}/images/grinning-face_1f600.png`);
    },

    get: function (match, data) {
      return {
        body: data,
      };
    },
  },
];
