#!/usr/bin/env bash
set -e
rm -rf build
node_modules/.bin/truffle compile --all
# ./combineContracts.js $1