#!/bin/bash
set -ev

echo "=======  Starting build-and-test.sh  ========================================"

# Go to project dir
cd $(dirname $0)/../..

# Normal build
npm run build -s

# Run the test
npm run test -s

# Run the lint
npm run lint -s

# Only run prod build if on a branch build or PR for stable
if [ "${TRAVIS_PULL_REQUEST}" = "false" ] || [ "${TRAVIS_BRANCH}" = "stable" ]; then
	npm run -s build:prod
    npm run -s build-python
    npm run package
fi

# Only package if on stable branch
if [ "${TRAVIS_BRANCH}" = "stable" ]; then 
    npm run package
fi
