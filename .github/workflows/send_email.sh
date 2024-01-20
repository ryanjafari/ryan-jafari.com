#!/bin/bash

IFS='|' read -r article_date article_title article_description <<<"$ARTICLE_DATA"

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
