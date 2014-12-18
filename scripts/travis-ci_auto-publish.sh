#!/bin/bash
if [ "$TRAVIS_REPO_SLUG" == "hannes-hochreiner/project-template-offline-gh-pages" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then
  echo -e "Publishing...\n"
  
  cp -r . $HOME/export
  
  cd $HOME
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "travis-ci"
  git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/hannes-hochreiner/project-template-offline-gh-pages gh-pages > /dev/null
  cd gh-pages
  git rm -rf .
  cp -rf $HOME/export/app .
  cp -rf $HOME/export/lib .
  cp -rf $HOME/export/index.html .

  git add -f .
  git commit -m "Lastest version on successful travis build $TRAVIS_BUILD_NUMBER auto-pushed to gh-pages"
  git push -fq origin gh-pages > /dev/null
  echo -e "Published to gh-pages.\n"
fi
