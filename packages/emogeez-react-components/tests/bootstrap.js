import jsdom from 'jsdom';

const {JSDOM} = jsdom;

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
const propagateToGlobal = (win) => {
  for (let key in win) {
    if (!win.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = win[key]
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
`);
global.window = doc.window;
// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(window);

// add localStorage support in tests suite
// Storage Mock
function storageMock() {
  let storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      let keys = Object.keys(storage);
      return keys[i] || null;
    },
    clear: function() {
      storage = {};
    }
  };
}

global.localStorage = storageMock();
global.sessionStorage = storageMock();

// mock the localStorage
window.localStorage = global.localStorage;
// mock the sessionStorage
window.sessionStorage = global.sessionStorage;
