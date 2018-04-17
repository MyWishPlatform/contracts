#!/usr/bin/env bash
set -e
rm -rf build
rm -rf node_modules/truffle/node_modules/solc
node_modules/.bin/truffle compile --all
# ./combineContracts.js $1