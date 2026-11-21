#!/bin/bash
set -e

FUNCTION_NAME="bible-reader"
ROLE_NAME="bible-reader-lambda-role"
REGION="us-east-1"
RUNTIME="nodejs20.x"
HANDLER="src/index.handler"

echo "=== Bible Reader — First-time AWS Setup ==="

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

# ── Get AWS account ID ───────────────────────────────────────────────────────
echo "Fetching AWS account info..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account ID: $ACCOUNT_ID"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
LAMBDA_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}"

# ── IAM role ─────────────────────────────────────────────────────────────────
if aws iam get-role --role-name "$ROLE_NAME" > /dev/null 2>&1; then
  echo "IAM role already exists: $ROLE_NAME"
else
  echo "Creating IAM role..."
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": { "Service": "lambda.amazonaws.com" },
        "Action": "sts:AssumeRole"
      }]
    }' > /dev/null

  aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

  echo "Waiting for IAM role to propagate..."
  sleep 10
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

# ── Create or update Lambda function ─────────────────────────────────────────
if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" > /dev/null 2>&1; then
  echo "Lambda function already exists — updating code and config..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file fileb://skill.zip \
    --region "$REGION" > /dev/null

  aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --environment "Variables={BIBLE_API_KEY=$BIBLE_API_KEY}" \
    --region "$REGION" > /dev/null
else
  echo "Creating Lambda function..."
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --runtime "$RUNTIME" \
    --role "$ROLE_ARN" \
    --handler "$HANDLER" \
    --zip-file fileb://skill.zip \
    --environment "Variables={BIBLE_API_KEY=$BIBLE_API_KEY}" \
    --timeout 10 \
    --memory-size 256 \
    --region "$REGION" > /dev/null
fi

# ── Alexa trigger permission ──────────────────────────────────────────────────
if aws lambda get-policy --function-name "$FUNCTION_NAME" --region "$REGION" 2>/dev/null | grep -q "alexa-skill"; then
  echo "Alexa trigger permission already set"
else
  echo "Adding Alexa trigger permission..."
  aws lambda add-permission \
    --function-name "$FUNCTION_NAME" \
    --statement-id alexa-skill \
    --action lambda:InvokeFunction \
    --principal alexa-appkit.amazon.com \
    --region "$REGION" > /dev/null
fi

# ── Update manifest.json with real ARN ───────────────────────────────────────
echo "Updating manifest.json with Lambda ARN..."
sed -i.bak "s|arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:bible-reader|${LAMBDA_ARN}|g" \
  skill-package/manifest/manifest.json
rm -f skill-package/manifest/manifest.json.bak

# ── Restore dev dependencies ──────────────────────────────────────────────────
npm install --silent

echo ""
echo "=== Setup complete ==="
echo ""
echo "Lambda ARN: $LAMBDA_ARN"
echo ""
echo "Next steps:"
echo "  1. Go to https://developer.amazon.com/alexa/console/ask"
echo "  2. Create a new custom skill named 'Bible Reader'"
echo "  3. Set the endpoint to: $LAMBDA_ARN"
echo "  4. Upload the interaction model from skill-package/interactionModels/custom/en-US.json"
echo "  5. Save and test with 'Alexa, ask Bible Reader to read John 3:16'"
