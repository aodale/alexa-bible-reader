# Bible Reader Alexa Skill

An Alexa skill that reads Bible verses, passages, and chapters in multiple translations.

## Features

- Read individual verses (e.g., "read John 3:16")
- Read passages (e.g., "read John 3:16 to 18")
- Read entire chapters (e.g., "read Psalm 23")
- Support for multiple Bible versions: KJV, NIV, ESV, NASB, NLT, NKJV
- User can set preferred Bible version per session

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get Bible API Key:**
   - Sign up at [API.Bible](https://scripture.api.bible/)
   - Copy your API key
   - Create `.env` file and add: `BIBLE_API_KEY=your_key_here`

3. **Deploy to AWS Lambda:**
   ```bash
   ./deploy.sh
   ```

4. **Configure Alexa Skill:**
   - Create a new skill in [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
   - Upload the interaction model from `skill-package/interactionModels/custom/en-US.json`
   - Set endpoint to your Lambda function ARN
   - Update manifest from `skill-package/manifest/manifest.json`

## Usage Examples

- "Alexa, ask Bible Reader to read John 3:16"
- "Alexa, ask Bible Reader to read Psalm 23 in NIV"
- "Alexa, ask Bible Reader to read Romans chapter 8"
- "Alexa, ask Bible Reader to read Matthew 5:3 to 12"
- "Alexa, ask Bible Reader to use ESV"

## Supported Bible Versions

- KJV (King James Version)
- NIV (New International Version)  
- ESV (English Standard Version)
- NASB (New American Standard Bible)
- NLT (New Living Translation)
- NKJV (New King James Version)