#!/bin/bash

# TODO: use this script's directory instead of "./"
# TODO: add verbose mode?

# extract version from package.json
# (https://gist.github.com/DarrenN/8c6a5b969481725a4413)
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# create packages
echo "Packaging app v.${PACKAGE_VERSION}.."
electron-packager ./ --platform=darwin --arch=x64 --overwrite --out out
electron-packager ./ --platform=win32 --arch=ia32 --overwrite --out out

# zip packages
printf "\nZipping Packages..\n"
cd out
for i in */; do zip -r "${i%/}-${PACKAGE_VERSION}.zip" "$i"; done

printf "\nOK!"
