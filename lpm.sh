#!/bin/bash
#npm install --save-dev typescript @types/node
npx tsc ./src/*.ts
node ./src/lpm.js $1 $2
rm -Rf ./src/*.js
