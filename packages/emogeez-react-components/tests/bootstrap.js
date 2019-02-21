/* eslint-disable*/
require('@babel/polyfill');
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
const propagateToGlobal = (win) => {
  for (let key in win) {
    if (!win.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = win[key];
  }
};

// setup the simplest document possible
// get the window object out of the document
// set globals for mocha that make access to document and window feel
// natural in the test environment
const doc = new JSDOM(`
<!doctype html>
<html>
    <body>
        <div id="content"></div>
    </body>
</html>
`, {
  url: 'https://example.org/',
  referrer: 'https://example.com/',
  contentType: 'text/html',
  includeNodeLocations: true,
  storageQuota: 10000000,
});
global.window = doc.window;
// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(window);
