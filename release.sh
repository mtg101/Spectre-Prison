#!/bin/bash

# ensure release directory exists
mkdir release

# clean
rm -r release/*

# Path to impact.js and your game's main .js
IMPACT_LIBRARY=lib/impact/impact.js
GAME=lib/game/main.js

# Output file
OUTPUT_FILE=release/game.min.js

# bake
php tools/bake.php $IMPACT_LIBRARY $GAME $OUTPUT_FILE

# copy media
mkdir release/media
cp media/* release/media/

# copy web
cp spectre.css release
cp index-release.html release/index.html
