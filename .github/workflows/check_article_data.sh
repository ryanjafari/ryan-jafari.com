#!/bin/bash

if [[ "$ARTICLE_DATA" ]]; then
  echo "ARTICLE_READY=true" >>"$GITHUB_ENV"
else
  echo "ARTICLE_READY=false" >>"$GITHUB_ENV"
fi
