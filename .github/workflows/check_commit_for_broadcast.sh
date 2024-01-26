#!/bin/bash

commit_message=$(git log -1 --pretty=%B)

# printf "The commit message is:\n\"%s\"\n" "$commit_message"

if [[ "$commit_message" =~ ^\[CK-Broadcast\]\ (src/app/articles/[^[:space:]]+\.[^[:space:]]+)([[:space:]]|$) ]]; then
  article_path=${BASH_REMATCH[1]}
  echo "[CK-Broadcast] Got article path: $article_path"

  if [[ "$article_path" == *.md || "$article_path" == *.mdx ]]; then
    echo "[CK-Broadcast] Valid file type: $article_path"

    if [[ -f $article_path ]]; then
      echo "[CK-Broadcast] File exists: $article_path"
      echo "article_path=$article_path" >>"$GITHUB_OUTPUT"
    else
      echo "[CK-Broadcast] File does not exist: $article_path"
    fi
  else
    echo "[CK-Broadcast] Invalid file type: $article_path"
  fi
else
  echo "[CK-Broadcast] Commit message did not match: $commit_message"
  echo "[CK-Broadcast] Expected format: [CK-Broadcast] src/app/articles/<article-name>.md(x)"
fi
