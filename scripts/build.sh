#!/bin/bash

basePath=$PWD/packages/

cd $basePath/emogeez-generator
yarn run build
cd $basePath/emogeez-parser
yarn run build
cd $basePath/emogeez-react-components
yarn run build
