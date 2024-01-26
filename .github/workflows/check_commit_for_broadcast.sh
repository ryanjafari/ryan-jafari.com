#!/bin/bash

commit_message=$(git log -1 --pretty=%B)

if [[ "$commit_message" =~ ^\[CK-Broadcast\]\ (src/app/articles/[^[:space:]]+\.[^[:space:]]+)([[:space:]]|$) ]]; then
  path="${BASH_REMATCH[1]}"
  echo "[CK-Broadcast] Got path: $path"

  if [[ "$path" == *.md || "$path" == *.mdx ]]; then
    echo "[CK-Broadcast] Valid article file type: $path"

    if [[ -f "$path" ]]; then
      echo "[CK-Broadcast] Article exists: $path"
      article_path="$path"
      echo "article_path=$article_path" >>"$GITHUB_OUTPUT"
    else
      echo "[CK-Broadcast] Article does not exist: $path"
    fi
  else
    echo "[CK-Broadcast] Invalid file type: $path"
  fi
else
  echo "[CK-Broadcast] Commit message did not match expected format."
  echo "[CK-Broadcast] Expected format: [CK-Broadcast] src/app/articles/<article-name>.md(x) <commit-message>"
fi

if [[ -z "$article_path" ]]; then
  echo "[CK-Broadcast] No article path found. Will not broadcast."
  echo "article_path=" >>"$GITHUB_OUTPUT"
fi
