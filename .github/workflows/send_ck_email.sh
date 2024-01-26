#!/bin/bash

echo "$ARTICLE_DATA"

# article_data=$(node ./.github/worfklows/parseFrontMatter.js "$ARTICLE_PATH")
# IFS='|' read -r article_date article_title article_description <<<"$article_data"
# echo "[CK-Broadcast] Article data: $article_data"

# IFS='|' read -r article_date article_title article_description <<<"$article_data"
# echo "[CK-Broadcast] Article date: $article_date"
# echo "[CK-Broadcast] Article title: $article_title"
# echo "[CK-Broadcast] Article description: $article_description"

# # Prepare the email content
# email_subject="New Blog Post: $article_title"
# email_body="<p>Published on: $article_date</p><p>$article_description</p>"

# # Construct the API endpoint URL
# ck_api_endpoint="${CK_API_BASE_URL}${CK_API_BROADCASTS_ENDPOINT}"

# # ConvertKit API call
# curl -X POST "$ck_api_endpoint" \
#   -H "Content-Type: application/json" \
#   -d '{
#         "api_key": "'"$CK_API_KEY"'",
#         "subject": "'"$email_subject"'",
#         "body": "'"$email_body"'"
#       }'
