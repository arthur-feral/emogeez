# Emogeez generator 👷‍♂️

This module is a tool for building emojis sprites for many themes to be used on web apps.
It gathers required informations from the website [Emojipedia](https://emojipedia.org) like images of all emojis in different themes and build an sprite image with all the emojis.
To display these emojis on webpages it generates also the stylesheet file with the positions.
To be used on web app easily, it build a JSON file with useful informations about each emojis for each categories.

Themes that can be used: `apple, emojione, emojidex, emojipedia, facebook, google, htc, lg, messenger, microsoft, mozilla, samsung, twitter, whatsapp`

Once the generator's work is done, you find the generated files into the specified folder (default in the current working directory).
For each themes, you will find a .json, .png and .sass or .less.

![generator](https://github.com/arthur-feral/emogeez/blob/master/packages/emogeez-generator/demo_generator.png)

#### The PNG
[apple.png](https://github.com/arthur-feral/emogeez/raw/master/packages/emogeez-generator/emojis/apple/apple.png)

#### The Stylesheet
The emojis positions are stored in this stylesheet. Each emoji has a classname based on his shortname and prefixed by the user (default `emojis-`).

```sass
[class^="emojis-"], [class*=" emojis-"] {
    background: transparent url("emojis/apple/apple.png") 0 0 no-repeat;
    display: inline-block;
    height: 48px;
    background-size: 1392px 1392px;
    width: 48px;
    vertical-align: middle;
}

.emojis-grapes {
    background-position: 48px 0px;
}
.emojis-melon {
    background-position: 960px 288px;
}
.emojis-watermelon {
    background-position: 0px 48px;
}
.emojis-tangerine {
    background-position: 48px 48px;
}
.emojis-lemon {
    background-position: 96px 0px;
}
// ...
```

#### The JSON
It stores useful informations about each emoji.

```JSON
{
  "food-drink": {
    "symbol": "🍔",
    "url": "https://emojipedia.org/food-drink/",
    "name": "food-drink",
    "fullName": "Food & Drink",
    "unicode": "1f354",
    "emojis": [
      {
        "symbol": "🍇",
        "name": "grapes",
        "fullName": "Grapes",
        "category": "food-drink",
        "unicode": "1f347",
        "shortnames": [
          "grapes"
        ],
        "shortname": "grapes"
      },
      {
        "symbol": "🍈",
        "name": "melon",
        "fullName": "Melon",
        "category": "food-drink",
        "unicode": "1f348",
        "shortnames": [
          "melon"
        ],
        "shortname": "melon"
      },
      {
        "symbol": "🍉",
        "name": "watermelon",
        "fullName": "Watermelon",
        "category": "food-drink",
        "unicode": "1f349",
        "shortnames": [
          "watermelon"
        ],
        "shortname": "watermelon"
      },
```
if an emoji owns modifiers (different version of an emoji like skin color etc...)
of course you will find the modifiers version of emojis (black skin etc...). They are stored into the original emoji `modifiers` key if any. The modifiers versions of an emoji will have the same `index` key than the original.
```
{
    "symbol": "🚣",
    "url": "https://emojipedia.org/rowboat/",
    "name": "rowboat",
    "fullName": "Person Rowing Boat",
    "category": "activity",
    "unicode": "1f6a3",
    "shortnames": [
      "rowboat"
    ],
    "modifiers": {
      "rowboat-type-1-2": {
        "parent": "rowboat",
        "fullName": "Person Rowing Boat: Light Skin Tone",
        "name": "rowboat-type-1-2",
        "symbol": "🚣🏻",
        "category": "activity",
        "url": "https://emojipedia.org/rowboat-type-1-2/",
        "unicode": "1f6a3-1f3fb",
        "shortnames": [
          "rowboat-type-1-2"
        ],
        "modifiers": {},
        "shortname": "rowboat-type-1-2"
      },
      "rowboat-type-3": {
        "parent": "rowboat",
        "fullName": "Person Rowing Boat: Medium-Light Skin Tone",
        "name": "rowboat-type-3",
        "symbol": "🚣🏼",
        "category": "activity",
        "url": "https://emojipedia.org/rowboat-type-3/",
        "unicode": "1f6a3-1f3fc",
        "shortnames": [
          "rowboat-type-3"
        ],
        "modifiers": {},
        "shortname": "rowboat-type-3"
      },
      "rowboat-type-4": {
        "parent": "rowboat",
        "fullName": "Person Rowing Boat: Medium Skin Tone",
        "name": "rowboat-type-4",
        "symbol": "🚣🏽",
        "category": "activity",
        "url": "https://emojipedia.org/rowboat-type-4/",
        "unicode": "1f6a3-1f3fd",
        "shortnames": [
          "rowboat-type-4"
        ],
        "modifiers": {},
        "shortname": "rowboat-type-4"
      },
      "rowboat-type-5": {
        "parent": "rowboat",
        "fullName": "Person Rowing Boat: Medium-Dark Skin Tone",
        "name": "rowboat-type-5",
        "symbol": "🚣🏾",
        "category": "activity",
        "url": "https://emojipedia.org/rowboat-type-5/",
        "unicode": "1f6a3-1f3fe",
        "shortnames": [
          "rowboat-type-5"
        ],
        "modifiers": {},
        "shortname": "rowboat-type-5"
      },
      "rowboat-type-6": {
        "parent": "rowboat",
        "fullName": "Person Rowing Boat: Dark Skin Tone",
        "name": "rowboat-type-6",
        "symbol": "🚣🏿",
        "category": "activity",
        "url": "https://emojipedia.org/rowboat-type-6/",
        "unicode": "1f6a3-1f3ff",
        "shortnames": [
          "rowboat-type-6"
        ],
        "modifiers": {},
        "shortname": "rowboat-type-6"
      }
    },
    "shortname": "rowboat"
}
```

### How to use

#### Installation 

##### prerequisites

You have to install [GraphicsMagick](http://www.graphicsmagick.org/)

On Mac
```bash
$ brew install graphicsmagick
```

On Linux
```bash
$ sudo apt-get install graphicsmagick
```

##### installation

```bash
$ yarn i emogeez-generator
```

##### Run

Run help command to have details
```bash
$ yarn run -h
```

Run it
```bash
$ yarn run --preproc sass -d path/to/the/folder -s 48 -c
```

###Options
**preproc**

```--preproc``` the css preprocessor you want to use (DEFAULT: sass). For now only sass and less are supported.

**destination**

```-d, --destination``` the place when files will be writen (DEFAULT: current working directory)

**size**

```-s, --size``` The sprite's height (DEFAULT: 48)

**prefix**

```-p, --prefix``` The classnames prefix on stylesheet file (DEFAULT: emoji)

**cache**

```-c, --cache``` Force using cache. In fact the program will get about 16k images and at least 1,7k html pages, so it caches datas on the first use and if you launch it again, it could use datas on the ``tmp/` folder. Don't use it if you want freash new datas from the websites. (DEFAULT: false)

# Notes
This is an early version. I know it needs some fixes and optimization but it works.
Please contribute if you found it useful! ❤️

```javascript
return 'enjoy';
```
