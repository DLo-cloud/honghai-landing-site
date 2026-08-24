#!/bin/zsh
cd "$(dirname "$0")"
echo "Starting local preview for Honghai Landing Site..."
echo "Open http://localhost:4173"
python3 -m http.server 4173
