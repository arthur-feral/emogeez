# Emogeez

Welcome.

Emogeez provide all the tools you need to integrate emojis in your apps.
You can find the sprites generator made to build different images with the latest emojis on Unicode for different themes.
A tool for parsing, replace or find emojis in texts.
And some UI components to display emojis in your apps. 

It is managed by [lerna](https://github.com/lerna/lerna) and [yarn workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

## How to start

```bash
# clone the project
$ git clone git@github.com:arthur-feral/emogeez.git

# install imagemagick dependency for emogeez-gegnerator
$ brew install graphicsmagick

# bootstrap the workspace
$ yarn
$ yarn run lerna-bootstrap
```

### emogeez-generator
![generator](https://github.com/arthur-feral/emogeez/blob/master/examples/demo_generator.png)

[README](https://github.com/arthur-feral/emogeez/blob/master/packages/emogeez-generator/README.md)
### emogeez-parser
[README](https://github.com/arthur-feral/emogeez/blob/master/packages/emogeez-parser/README.md)

### emogeez-react-components
![GIF example](https://github.com/arthur-feral/emogeez/blob/master/examples/demo_react_components.gif)

[README](https://github.com/arthur-feral/emogeez/blob/master/packages/emogeez-react-components/README.md)
