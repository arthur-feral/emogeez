#!/bin/bash

function build_packages () {
    for directory in packages/*; do
        printf "\n"
        CMD_DIRECTORY=$(pwd)
        configFile="$CMD_DIRECTORY/babel.config.js"
        echo $directory
        echo "clean $directory/dist"
        rm -r "$(pwd)/$directory/dist"

        echo "build $(pwd)/$directory"
        mkdir "$(pwd)/$directory/dist"
        libDir="$(pwd)/$directory"
        targetDir="$libDir/dist"

        cd $libDir
        CMD="$CMD_DIRECTORY/node_modules/.bin/babel . --out-dir dist --config-file $configFile --ignore cache,tests,node_modules,dist,**/*.test.js,./.storybook";
        $CMD || exit 1;
        cd - > /dev/null
    done
}

build_packages ""
