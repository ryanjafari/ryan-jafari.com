#!/bin/bash

commit_message=$(git log -1 --pretty=%B)

echo "The commit message is: $commit_message"

if [[ "$commit_message" =~ ^\[CK-Broadcast\]\ (.+)$ ]]; then
  article_path=${BASH_REMATCH[1]}
  echo "$article_path"

  if [[ -f $article_path ]]; then
    echo "article_path=$article_path" >>"$GITHUB_OUTPUT"
    echo "Will broadcast article: $article_path..."
  else
    echo "File does not exist: $article_path."
  fi
else
  echo "No article to broadcast"
fi
