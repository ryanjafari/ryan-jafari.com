#!/bin/bash

extract_article_data() {
  local path=$1
  local front_matter=()
  local key=""
  local value=""
  local article_data=()

  # Extract YAML front matter
  IFS=$'\n' read -r -d '' -a front_matter < <(sed -n '/^---$/,/^---$/p' "$path" && printf '\0')

  # Process each line in the front matter
  for line in "${front_matter[@]}"; do
    if [[ "$line" == "---" ]]; then
      continue
    elif [[ "$line" =~ ^[a-zA-Z_]+: ]]; then
      if [[ -n "$key" ]]; then
        article_data[$key]="$value"
      fi
      key=$(echo "$line" | cut -d ':' -f 1)
      value=$(echo "$line" | cut -d ':' -f 2- | sed -e 's/^ //' -e 's/'\''/\\'\''/g')
    else
      value+=" $line"
    fi
  done
  if [[ -n "$key" ]]; then
    article_data[$key]="$value"
  fi

  # Combine the required fields into a single string
  echo "${article_data[date]}|${article_data[title]}|${article_data[description]}"
}

article_data=$(extract_article_data "$ARTICLE_PATH")
IFS='|' read -r article_date article_title article_description <<<"$article_data"
echo "[CK-Broadcast] Article data: $article_data"

IFS='|' read -r article_date article_title article_description <<<"$article_data"
echo "[CK-Broadcast] Article date: $article_date"
echo "[CK-Broadcast] Article title: $article_title"
echo "[CK-Broadcast] Article description: $article_description"

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
