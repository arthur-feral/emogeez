#!/bin/bash
basePath=$PWD/packages/

cd $basePath/emogeez-generator && yarn run test
cd $basePath/emogeez-parser && yarn run test
cd $basePath/emogeez-react-components && yarn run test
