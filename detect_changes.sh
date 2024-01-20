#!/bin/bash

# Fetch the last two commits
git fetch --depth=2

# Get the file changes in src/app/articles directory between the last two commits
changed_files=$(git diff --name-status HEAD^ HEAD -- 'src/app/articles' | grep -E '\.md$|\.mdx$' || true)

# Check if there are any MD/MDX files
if [ -z "$changed_files" ]; then
  echo "No MD/MDX files changed"
  exit 0
fi

# Get the date of the last commit
last_commit_date=$(git log -1 --format=%cd --date=short)

# Process each changed MD/MDX file
echo "$changed_files" | while read -r status file; do
  echo "Processing: $status $file..."

  # Skip files with 'draft' in the filename
  if [[ "$file" == *"draft"* ]]; then
    echo "Skipping draft/invalid file: $file"
    continue
  fi

  # Extract YAML front matter
  IFS=$'\n' read -r -d '' -a front_matter < <(sed -n '/^---$/,/^---$/p' "$file" && printf '\0')

  # Initialize variables for date, title, and description
  article_date=""
  article_title=""
  article_description=""

  # Extract date, title, and description from the front matter
  for line in "${front_matter[@]}"; do
    if [[ "$line" == "date:"* ]]; then
      article_date=$(echo "$line" | cut -d "'" -f 2)
    elif [[ "$line" == "title:"* ]]; then
      article_title=$(echo "$line" | cut -d "'" -f 2)
    elif [[ "$line" == "description:"* ]]; then
      article_description=$(echo "$line" | cut -d "'" -f 2)
    fi
  done

  # Check if article date is older than the last commit date
  if [[ "$article_date" < "$last_commit_date" ]]; then
    echo "Skipping older article: $file"
    continue
  fi

  # Write outputs to the GITHUB_OUTPUT file
  echo "article_data=$article_date|$article_title|$article_description" >>"$GITHUB_OUTPUT"

  echo "Will send article: $article_title"
  echo "Written on: $article_date"
done
