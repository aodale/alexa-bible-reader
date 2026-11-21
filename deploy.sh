#!/bin/bash
set -e

FUNCTION_NAME="bible-reader"
REGION="us-east-1"

echo "=== Bible Reader — Deploy Update ==="

# ── Validate .env ────────────────────────────────────────────────────────────
if [ ! -f .env ]; then
  echo "Error: .env file not found"
  exit 1
fi
source .env
if [ -z "$BIBLE_API_KEY" ]; then
  echo "Error: BIBLE_API_KEY not set in .env"
  exit 1
fi

# ── Confirm function exists ───────────────────────────────────────────────────
if ! aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" > /dev/null 2>&1; then
  echo "Error: Lambda function '$FUNCTION_NAME' not found. Run setup.sh first."
  exit 1
fi

# ── Build deployment package ─────────────────────────────────────────────────
echo "Building deployment package..."
rm -f skill.zip

zip -r skill.zip . -x \
  "node_modules/*" \
  "tests/*" \
  "*.git*" \
  "setup.sh" \
  "deploy.sh" \
  "README.md" \
  ".env*" > /dev/null

npm install --production --silent
zip -r skill.zip node_modules/ > /dev/null

# ── Push code and config ──────────────────────────────────────────────────────
echo "Uploading code..."
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://skill.zip \
  --region "$REGION" > /dev/null

echo "Updating environment variables..."
aws lambda update-function-configuration \
  --function-name "$FUNCTION_NAME" \
  --environment "Variables={BIBLE_API_KEY=$BIBLE_API_KEY}" \
  --region "$REGION" > /dev/null

# ── Restore dev dependencies ──────────────────────────────────────────────────
npm install --silent

echo ""
echo "=== Deploy complete ==="
