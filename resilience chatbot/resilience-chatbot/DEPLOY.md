# Resilience Fitness Chatbot — Deployment Guide

## What's in this project

```
resilience-chatbot/
├── api/
│   └── chat.js          ← Vercel Edge Function (proxies to Claude API, streams responses)
├── public/
│   ├── widget.js         ← Embeddable chat widget (drop into any website)
│   └── test.html         ← Local test page
├── vercel.json           ← Vercel routing config
├── package.json
├── .env.example
└── .gitignore
```

## Step 1: Deploy to Vercel

### Option A — Via Vercel Dashboard (easiest)
1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. In the **Environment Variables** section, add:
   - `ANTHROPIC_API_KEY` = your Claude API key from [console.anthropic.com](https://console.anthropic.com)
4. Click **Deploy**
5. Note your project URL (e.g., `https://resilience-chatbot.vercel.app`)

### Option B — Via Vercel CLI
```bash
npm i -g vercel
cd resilience-chatbot
vercel login
vercel --prod
# When prompted, add your ANTHROPIC_API_KEY as an environment variable
```

## Step 2: Update the widget URL

Open `public/widget.js` and change line ~5:
```js
apiUrl: "https://YOUR-PROJECT.vercel.app/api/chat",
```
to your actual Vercel URL:
```js
apiUrl: "https://resilience-chatbot.vercel.app/api/chat",
```

Then redeploy.

## Step 3: Add to WordPress

### Option A — Simple script tag (recommended)
Add this to your WordPress theme's `footer.php` (before `</body>`), or use a plugin like **Insert Headers and Footers**:

```html
<script src="https://resilience-chatbot.vercel.app/widget.js"></script>
```

### Option B — WordPress code snippet plugin
1. Install **WPCode** (or similar snippet plugin)
2. Create a new snippet → choose **Site Wide Footer**
3. Paste the script tag above
4. Activate

### Option C — Via WordPress Customizer
1. Go to Appearance → Customize → Additional CSS/JS
2. Some themes allow adding scripts here — paste the script tag

## Step 4: Lock down CORS (optional but recommended)

Once live, update the CORS header in `api/chat.js` to only allow your domain:

```js
"Access-Control-Allow-Origin": "https://resiliencefitness.ca",
```

This prevents other sites from using your API endpoint.

## Testing

1. Visit `https://your-vercel-url.vercel.app/test.html` to test the chatbot standalone
2. On your WordPress site, the chat bubble should appear in the bottom-right corner
3. Try these test messages:
   - "What classes do you offer?"
   - "How do I cancel a class?"
   - "I want to try the gym, what's the best deal?"
   - "What's HYROX?"
   - "My app isn't working"

## Costs

- **Vercel**: Free tier covers ~100K function invocations/month
- **Claude API**: ~$3/million input tokens, ~$15/million output tokens (Sonnet)
- Typical chat session = ~2K input + 500 output tokens ≈ $0.01 per conversation

## Troubleshooting

**Chat shows error message:**
- Check Vercel function logs (Dashboard → Project → Functions tab)
- Verify `ANTHROPIC_API_KEY` is set in Vercel environment variables

**Widget doesn't appear on WordPress:**
- Check browser console for errors
- Make sure the script tag is loading (check Network tab)
- Verify no ad-blockers are interfering

**CORS errors:**
- The API function allows all origins by default
- If you've locked it down, make sure your domain matches exactly
