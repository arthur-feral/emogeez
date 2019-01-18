# Emogeez React Components

This module provides react elements to display emojis in your web app. It exposes a popup to choose your emoji.
The popup can be populated with emojis with the [emogeez-parser](https://github.com/arthur-feral/emogeez/blob/master/packages/emogeez-parser/README.md) store, 
or you can fetch manually the json file generated with [emogeez-generator](https://github.com/arthur-feral/emogeez/blob/master/packages/emogeez-generator/README.md)
[hosted here](https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@latest/packages/emogeez-generator/emojis/apple/apple.json)(https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@latest/packages/emogeez-generator/emojis/apple/apple.json).

<p align="center">
  <img src="https://raw.githubusercontent.com/arthur-feral/emogeez/master/packages/emogeez-react-components/popup_emojis.png">
</p>

You can test it by running the storybook.
clone the project
```bash
$ git clone https://github.com/arthur-feral/emogeez.git
$ cd emogeez/packages/emogeez-react-components
$ yarn && yarn run storybook
```
and go to [http://localhost:9001](http://localhost:9001) to explore the components.

### How to use

### Installation 
```bash
$ yarn i emogeez-react-components
```

#### to be used in your application
you can use the package `emogeez-parser`, go to the README for more informations. Shortly you may do something like this:

```javascript
import parserFactory from 'emogeez-parser';
import React from 'react';
import ReactDOM from 'react-dom';
import emojisComponents from 'emogeez-react-components';

const {
  EmojisPopupToggler,
} = emojisComponents;
const {
  store,
} = parserFactory();

const addEmojiToTextArea = (emoji /* the emoji data */, event /* click event */) => {
  // add the clicked emoji in the textarea or anywhere you want
};

fetchTheme('apple')
    .then(() => {
      const categories = Object.entries(store.getCategories('apple'));
      ReactDOM.render(
        <EmojisPopupToggler
          categories={categories}
          onClickEmoji={addEmojiToTextArea}
        />,
        document.getElementById('myContainer')
      );
    });
```

#### Emoji
```javascript
static propTypes = {
  // a prefix before the emoji name
  // it will construct the emoji classname
  // default will be emoji-grinning-face for example
  prefix: PropTypes.string,
  
  // the emoji data from the json
  emoji: PropTypes.object.isRequired,
  
  // on click on the emoji
  onClick: PropTypes.func,
};
static defaultProps = {
  prefix: 'emojis-',
  onClick: noop,
};
```
#### EmojiPopupToggler
```javascript
static propTypes = {
  // a prefix before the emoji name
  // it will construct the emoji classname
  // default will be emoji-grinning-face for example
  prefix: PropTypes.string,
    
  // an array of categories from the json file
  categories: PropTypes.array,

  // what to do on click on the emoji
  onClickEmoji: PropTypes.func,
  
  // choose to open it on first render
  isOpened: PropTypes.bool,
  
  // the popup can memorize the previously selected emojis
  // it is stored in the localStorage
  historyEnabled: PropTypes.bool,
  historyLimit: PropTypes.number,
  
  togglerRenderer: PropTypes.func,
  
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  
  // if you want the popup to be placed according to a parent
  // the popup will try to be contained in it
  containerClassNameForPlacement: PropTypes.string,
  
  // if you want to unmount the popup from the DOM
  // on the last toggler unmount
  // it means next time you render a new toggler
  // and if it's the only one,
  // then we re-render a popup
  destroyPopupIfNoToggler: PropTypes.bool,
};
static defaultProps = {
  prefix: 'emojis',
  categories: [],
  onClickEmoji: noop,
  isOpened: false,
  historyEnabled: true,
  historyLimit: 21,
  togglerRenderer: (props, state) => (
    <button>
      <People className={CLASSNAMES.icon} />
    </button>
  ),
  onOpen: noop,
  onClose: noop,
  containerClassNameForPlacement: null,
  destroyPopupIfNoToggler: false,
};
```

# Notes

Please contribute if you found it useful! ❤️

```javascript
return 'enjoy';
```
