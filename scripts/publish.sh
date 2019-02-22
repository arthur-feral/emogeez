#!/bin/bash

VERSION="$1"
ALLOWED_VALUES=(major minor patch canary)

if [ "$VERSION" = "" ]; then
  VERSION="minor"
fi

if [[ " ${ALLOWED_VALUES[*]} " != *" $VERSION "* ]]; then
    echo "Bad version name"
    exit 1;
fi


yarn run lerna version $VERSION --exact --force-publish=* -m \"misc: lerna version %v\" --no-git-tag-version --no-push --yes
NEW_VERSION=$(node -p -e "require('./lerna.json').version")
echo "publishing $VERSION $NEW_VERSION"

find $(pwd)/packages/emogeez-generator/emojis -type f -name "*.*css" -exec sed -E -i '' 's/emogeez@(([0-9]+(\.[0-9]+)+)|latest)/emogeez@'"$NEW_VERSION"'/g' {} +
git add -A
git commit -m "misc: publish %v"
git push origin/master

yarn run lerna publish --yes --dist-tag v$NEW_VERSION
