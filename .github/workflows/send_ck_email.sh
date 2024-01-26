#!/bin/bash

article_data=$(extract_article_data "$ARTICLE_PATH")

IFS='|' read -r article_date article_title article_description <<<"$article_data"

# Prepare the email content
email_subject="New Blog Post: $article_title"
email_body="<p>Published on: $article_date</p><p>$article_description</p>"

# Construct the API endpoint URL
ck_api_endpoint="${CK_API_BASE_URL}${CK_API_BROADCASTS_ENDPOINT}"

# ConvertKit API call
curl -X POST "$ck_api_endpoint" \
  -H "Content-Type: application/json" \
  -d '{
        "api_key": "'"$CK_API_KEY"'",
        "subject": "'"$email_subject"'",
        "body": "'"$email_body"'"
      }'

extract_article_data() {
  local path=$1
  local front_matter=()
  local article_date=""
  local article_title=""
  local article_description=""

  # Extract YAML front matter
  IFS=$'\n' read -r -d '' -a front_matter < <(sed -n '/^---$/,/^---$/p' "$path" && printf '\0')

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

  echo "$article_date|$article_title|$article_description"
}
