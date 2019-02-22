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

echo "preparing $VERSION"

yarn run lerna version $VERSION --force-publish=* --exact --no-push -m "misc: lerna version %v" --yes
NEW_VERSION=$(node -p -e "require('./lerna.json').version")


echo "updating files with new version $NEW_VERSION"
find $(pwd)/packages/emogeez-generator/emojis -type f -name "*.*css" -exec sed -E -i '' 's/emogeez@(([0-9]+(\.[0-9]+)+)|latest)/emogeez@'"$NEW_VERSION"'/g' {} +
find $(pwd)/packages/emogeez-parser/lib/ -type f -name "*.js" -exec sed -E -i '' 's/emogeez@(([0-9]+(\.[0-9]+)+)|latest)/emogeez@'"$NEW_VERSION"'/g' {} +
git add -A
git commit -m "misc: update assets files with version $NEW_VERSION"
git push origin $(git branch | grep \* | cut -d ' ' -f2)

echo "publishing $VERSION $NEW_VERSION"
yarn run lerna publish from-package --force-publish=* --yes
