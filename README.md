# Search Complexity Calculator - Deployment Guide

## Quick Deploy to Vercel (10 minutes)

### Step 1: Create a GitHub Repository
1. Go to github.com and create a new repository (e.g., `search-calculator`)
2. Upload all these files to the repository

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login (free)
2. Click "Add New Project"
3. Import your GitHub repository
4. **Important:** Add your environment variable:
   - Click "Environment Variables"
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key (starts with `sk-ant-`)
5. Click "Deploy"

### Step 3: Share the Link
Once deployed, Vercel gives you a URL like:
`https://search-calculator-xxxxx.vercel.app`

Share this with your client for testing.

---

## Local Development

```bash
# Install dependencies
npm install

# Run locally (API won't work without environment variable)
npm run dev

# To test API locally, create a .env file:
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env
```

---

## File Structure

```
calculator-deploy/
├── api/
│   └── analyze.js        # Serverless function (Claude API)
├── src/
│   ├── Calculator.jsx    # Main calculator component
│   ├── App.jsx          # App wrapper
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

---

## Security Notes

- The API key is stored as an environment variable in Vercel (never exposed to browser)
- The `/api/analyze` endpoint is a serverless function that runs on Vercel's servers
- Client-side code only sends the prompt, never the API key

---

## After Client Testing

Once approved, Sergey can:
1. Embed this as an iframe in Webflow
2. Or migrate the component directly into the Webflow project with proper server-side handling
