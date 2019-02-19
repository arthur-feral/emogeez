# Emogeez generator 👷‍♂️

This module is a tool for building emojis sprites for many themes to be used on web apps.
It gathers required informations from the website [Emojipedia](https://emojipedia.org) like images of all emojis in different themes and build an sprite image with all the emojis and the stylesheet file associated with all the emojis positions.
To be used on web app easily, it build a JSON file with useful informations about each emojis for each categories.
You can after this use the [emogeez-react-components](https://github.com/arthur-feral/emogeez/blob/master/packages/emogeez-react-components/README.md) components library to display them on your app.

---
Themes that can be used: `apple, emojione, emojidex, emojipedia, facebook, google, htc, lg, messenger, microsoft, mozilla, samsung, twitter, whatsapp`

Once the generator's work is done, you find the generated files into the specified folder (default in the current working directory).
For each themes, you will find a .json, .png and .sass or .less and a .css file.

![generator](https://github.com/arthur-feral/emogeez/raw/master/packages/emogeez-generator/demo_generator.png)

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
"father-christmas": {
    "symbol": "🎅",
    "name": "father-christmas",
    "fullName": "Santa Claus",
    "category": "people",
    "unicode": "1f385",
    "shortnames": [
      "santa"
    ],
    "modifiers": {
      "father-christmas-type-1-2": {
        "parent": "father-christmas",
        "fullName": "Santa Claus: Light Skin Tone",
        "name": "father-christmas-type-1-2",
        "symbol": "🎅🏻",
        "category": "people",
      },
      "father-christmas-type-3": {
        "parent": "father-christmas",
        "fullName": "Santa Claus: Medium-Light Skin Tone",
        "name": "father-christmas-type-3",
        "symbol": "🎅🏼",
        "category": "people",
      },
      "father-christmas-type-4": {
        "parent": "father-christmas",
        "fullName": "Santa Claus: Medium Skin Tone",
        "name": "father-christmas-type-4",
        "symbol": "🎅🏽",
        "category": "people",
      },
      "father-christmas-type-5": {
        "parent": "father-christmas",
        "fullName": "Santa Claus: Medium-Dark Skin Tone",
        "name": "father-christmas-type-5",
        "symbol": "🎅🏾",
        "category": "people",
      },
      "father-christmas-type-6": {
        "parent": "father-christmas",
        "fullName": "Santa Claus: Dark Skin Tone",
        "name": "father-christmas-type-6",
        "symbol": "🎅🏿",
        "category": "people",
      }
    },
    "shortname": "santa"
    // ...
```
if an emoji owns modifiers (different version of an emoji like skin color etc...)
of course you will find the modifiers version of emojis (black skin etc...). They are stored into the original emoji `modifiers` key if any.

### How to use

#### Installation 

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
$ yarn run --preproc sass -d path/to/the/folder -s 24 -c
```

###Options
**preproc**

```--preproc``` the css preprocessor you want to use (DEFAULT: sass). For now only sass and less are supported.

**destination**

```-d, --destination``` the place when files will be writen (DEFAULT: current working directory)

**size**

```-s, --size``` The sprite's height (DEFAULT: 24)

**prefix**

```-p, --prefix``` The classnames prefix on stylesheet file (DEFAULT: emoji)

**cache**

```-c, --cache``` Force using cache. In fact the program will get about 20k images and at least 2k html pages, so it caches datas on the first use and if you launch it again, it could use datas on the ``tmp/` folder. Don't use it if you want fresh new datas from the websites. (DEFAULT: false)

# Notes
This is an early version. I know it needs some fixes and optimization but it works.
Please contribute if you found it useful! ❤️

```javascript
return 'enjoy';
```
