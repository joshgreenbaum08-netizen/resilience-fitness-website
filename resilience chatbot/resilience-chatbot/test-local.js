#!/usr/bin/env node

// ─── Resilience Chatbot — Local Test Server ───
// Run: node test-local.js
// Then open: http://localhost:3456

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3456;

// ⚠️ Paste your Anthropic API key here (or set ANTHROPIC_API_KEY env var)
const ANTHROPIC_API_KEY =
  process.env.ANTHROPIC_API_KEY ||
  "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";

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1024;

// Read system prompt from the API file
const apiSrc = fs.readFileSync(path.join(__dirname, "api", "chat.js"), "utf-8");
const promptMatch = apiSrc.match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/);
const SYSTEM_PROMPT = promptMatch ? promptMatch[1] : "You are a helpful fitness assistant.";

const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  // ─── Chat API proxy ───
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { messages } = JSON.parse(body);

        const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: SYSTEM_PROMPT,
            messages: messages.slice(-20),
            stream: true,
          }),
        });

        if (!apiRes.ok) {
          const err = await apiRes.text();
          console.error("Claude API error:", apiRes.status, err);
          res.writeHead(502, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Claude API error " + apiRes.status }));
        }

        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });

        const reader = apiRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(Buffer.from(value));
        }
        res.end();
      } catch (err) {
        console.error("Error:", err.message);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      }
    });
    return;
  }

  // ─── Serve widget.js with localhost URL ───
  if (req.url === "/widget.js") {
    let widget = fs.readFileSync(path.join(__dirname, "public", "widget.js"), "utf-8");
    widget = widget.replace(
      "https://YOUR-PROJECT.vercel.app/api/chat",
      "http://localhost:" + PORT + "/api/chat"
    );
    res.writeHead(200, { "Content-Type": "application/javascript" });
    return res.end(widget);
  }

  // ─── Serve test page ───
  const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resilience Fitness — Live Chatbot Test</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; }
    .site { max-width: 1100px; margin: 0 auto; padding: 60px 24px; }
    .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #222; margin-bottom: 60px; }
    .logo { font-size: 22px; font-weight: 800; color: #C4D031; }
    .links { display: flex; gap: 28px; }
    .links span { color: #777; font-size: 14px; font-weight: 500; }
    .hero { text-align: center; padding: 80px 0 60px; }
    .hero h1 { font-size: 3.2rem; font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 16px; }
    .hero h1 em { color: #C4D031; font-style: normal; }
    .hero p { font-size: 1.15rem; color: #888; max-width: 520px; margin: 0 auto 32px; line-height: 1.6; }
    .btn { display: inline-block; background: #C4D031; color: #1a1a1a; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none; }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
    .card { background: #151515; border: 1px solid #222; border-radius: 14px; padding: 28px; }
    .card h3 { color: #C4D031; font-size: 15px; font-weight: 700; margin-bottom: 8px; }
    .card p { color: #888; font-size: 13px; line-height: 1.55; }
    .banner { position: fixed; top: 0; left: 0; right: 0; background: #C4D031; color: #1a1a1a; text-align: center; padding: 8px; font-size: 13px; font-weight: 600; z-index: 100000; }
    @media (max-width: 700px) { .hero h1 { font-size: 2rem; } .cards { grid-template-columns: 1fr; } .links { display: none; } }
  </style>
</head>
<body>
  <div class="banner">LIVE TEST — Real Claude API responses. Click the green bubble.</div>
  <div class="site">
    <nav class="nav"><div class="logo">RESILIENCE FITNESS</div><div class="links"><span>Classes</span><span>Schedule</span><span>Memberships</span><span>HYROX</span><span>Contact</span></div></nav>
    <div class="hero">
      <h1>Iron Sharpens <em>Iron</em></h1>
      <p>#1 HYROX Gym in Toronto & Durham. Hybrid training that builds strength, conditioning, and community.</p>
      <a href="#" class="btn">Start Your 10-Day Trial — $24.95</a>
    </div>
    <div class="cards">
      <div class="card"><h3>HYROX Training</h3><p>Full race simulations, certified coaches, genuine HYROX equipment.</p></div>
      <div class="card"><h3>Hybrid Classes</h3><p>EPOX, Ignite, Shred, Survivor — just show up and get better.</p></div>
      <div class="card"><h3>Two Locations</h3><p>East York & Durham. Purpose-built facilities for serious training.</p></div>
    </div>
  </div>
  <script src="/widget.js"></script>
</body>
</html>`;

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(testHtml);
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║  Resilience Fitness Chatbot — Local Test Server  ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Open in browser: http://localhost:${PORT}          ║
║  Click the green chat bubble to start talking.   ║
║                                                  ║
║  Press Ctrl+C to stop.                           ║
╚══════════════════════════════════════════════════╝
`);
});
