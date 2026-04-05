#!/bin/bash
# Resilience Fitness — Local Site Preview
# Double-click this file to launch the site in your browser

cd "$(dirname "$0")"
echo "Starting Resilience Fitness preview server..."
open http://localhost:8080
python3 -m http.server 8080
