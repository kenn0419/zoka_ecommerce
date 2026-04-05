#!/bin/sh

# Replace placeholders in JS files with environment variables
# We use a unique prefix to avoid accidental replacements
# Default to /api/v1 if not set

API_URL="${VITE_API_URL:-/api/v1}"

echo "Injecting runtime environment variables..."
echo "VITE_API_URL=${API_URL}"

# Replace the placeholder in all JS files in the static folder
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|REPLACE_ME_VITE_API_URL|${API_URL}|g" {} +

# Execute the CMD from Dockerfile
exec "$@"
