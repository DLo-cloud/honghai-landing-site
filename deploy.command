#!/bin/zsh
set -e

cd "$(dirname "$0")"

echo "Checking website changes..."
git status --short

if [[ -z "$(git status --short)" ]]; then
  echo "No changes to deploy."
  exit 0
fi

echo ""
echo "Enter a short update message, then press Return."
echo "Example: update homepage text"
read "message?Deploy message: "

if [[ -z "$message" ]]; then
  message="Update website"
fi

git add .
git commit -m "$message"
git push origin main

echo ""
echo "Done. Cloudflare will deploy the new version automatically."
