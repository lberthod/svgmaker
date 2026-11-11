#!/bin/sh
# Logo PNG 1080x1080 : node make.mjs, rendu svgmaker d'une seconde, image extraite par ffmpeg.
cd "$(dirname "$0")/../../.." && node examples/renard-lapin/logo/make.mjs \
 && node bin/svgmaker.mjs render examples/renard-lapin/logo/logo.svg -f --no-cover >/dev/null \
 && ffmpeg -v error -y -ss 0.9 -i examples/renard-lapin/logo/logo.mp4 -frames:v 1 examples/renard-lapin/logo/logo.png \
 && rm examples/renard-lapin/logo/logo.mp4 && echo logo.png
