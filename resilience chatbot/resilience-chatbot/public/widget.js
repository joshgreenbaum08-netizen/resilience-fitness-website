(function () {
  "use strict";

  // ─── Configuration ───────────────────────────────────────────────
  const CONFIG = {
    // CHANGE THIS to your deployed Vercel URL
    apiUrl: "https://resilience-chatbot.vercel.app/api/chat",
    brandColor: "#C8F135",
    brandColorDark: "#d4f548",
    title: "Resilience Fitness",
  };

  // ─── Quick-start categories & sub-questions ──────────────────────
  const CATEGORIES = [
    {
      icon: "👋",
      label: "New to Resilience?",
      questions: [
        "Is Resilience right for me, or is it too intense?",
        "Can I bring a friend to try a class?",
        "Do I need to be fit to start?",
        "What makes Resilience different from a regular gym?",
        "What should I expect on my first day?",
      ],
    },
    {
      icon: "💪",
      label: "Classes & Training",
      questions: [
        "What classes do you offer?",
        "What's the difference between all the class formats?",
        "What should I try as a beginner?",
      ],
    },
    {
      icon: "💳",
      label: "Memberships & Pricing",
      questions: [
        "What are the membership options?",
        "Which plan is right for me?",
        "Do you have an intro offer for new members?",
      ],
    },
    {
      icon: "📱",
      label: "App & Booking",
      questions: [
        "How do I book a class?",
        "How do I cancel a class?",
        "My app isn't working — help!",
      ],
    },
    {
      icon: "🏅",
      label: "HYROX",
      questions: [
        "What is HYROX?",
        "Why train HYROX at Resilience?",
        "Am I ready for a HYROX race?",
        "I want to train for my first HYROX race",
        "How do I sign up for a HYROX race?",
      ],
    },
    {
      icon: "💰",
      label: "Payments & Account",
      questions: [
        "How do I update my credit card?",
        "I see an unexpected charge",
        "How do I cancel or pause my membership?",
      ],
    },
    {
      icon: "✅",
      label: "Am I On Track?",
      questions: [
        "My body is so sore — is that normal?",
        "When will I start seeing results?",
        "I feel lost in class — what should I do?",
      ],
    },
    {
      icon: "🏋️",
      label: "Fitness & Health Advice",
      questions: [
        "I'm new to fitness — where do I start?",
        "How many times a week should I train?",
        "How do I balance strength and cardio?",
      ],
    },
  ];

  // ─── State ───────────────────────────────────────────────────────
  let isOpen = false;
  let isLoading = false;
  let onHomePage = true;
  let conversationHistory = [];

  // ─── Styles ──────────────────────────────────────────────────────
  const styles = document.createElement("style");
  styles.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

    #rf-chat-widget * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Barlow Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* ── Pulse ring ── */
    @keyframes rf-pulse-ring {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.9); opacity: 0; }
    }
    #rf-chat-bubble::before {
      content: '';
      position: absolute;
      width: 100%; height: 100%;
      border-radius: 50%;
      background: ${CONFIG.brandColor};
      animation: rf-pulse-ring 1.8s ease-out infinite;
      z-index: -1;
    }
    #rf-chat-bubble.rf-open::before {
      animation: none;
    }

    /* ── Floating label ── */
    #rf-chat-label {
      position: fixed; bottom: 32px; right: 96px;
      background: #fff; color: #1a1a1a;
      font-size: 13px; font-weight: 600;
      padding: 8px 14px; border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      white-space: nowrap; cursor: pointer;
      z-index: 99999;
      opacity: 1;
      transform: translateX(0);
      transition: opacity 0.3s ease, transform 0.3s ease;
      display: flex; align-items: center; gap: 6px;
    }
    #rf-chat-label.rf-label-hidden {
      opacity: 0;
      transform: translateX(10px);
      pointer-events: none;
    }
    #rf-chat-label::after {
      content: '';
      position: absolute; right: -7px; top: 50%;
      transform: translateY(-50%);
      border-left: 7px solid #fff;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }

    /* ── Bubble ── */
    #rf-chat-bubble {
      position: fixed; bottom: 24px; right: 24px;
      width: 60px; height: 60px; border-radius: 50%;
      background: ${CONFIG.brandColor}; color: #1a1a1a;
      border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      z-index: 99999;
    }
    #rf-chat-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(0,0,0,0.3);
    }
    #rf-chat-bubble svg { width: 28px; height: 28px; transition: opacity 0.2s ease; }
    #rf-chat-bubble .rf-close-icon { position: absolute; opacity: 0; }
    #rf-chat-bubble.rf-open .rf-chat-icon { opacity: 0; }
    #rf-chat-bubble.rf-open .rf-close-icon { opacity: 1; }

    /* ── Window ── */
    #rf-chat-window {
      position: fixed; bottom: 100px; right: 24px;
      width: 400px; max-width: calc(100vw - 32px);
      height: 620px; max-height: calc(100vh - 140px);
      background: #0A0A0A; border-radius: 4px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.45);
      display: flex; flex-direction: column; overflow: hidden;
      z-index: 99998;
      opacity: 0; transform: translateY(16px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    #rf-chat-window.rf-visible {
      opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
    }

    /* ── Header bar ── */
    .rf-header {
      background: #0A0A0A; padding: 16px 20px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      min-height: 56px;
    }
    .rf-header-left {
      display: flex; align-items: center; gap: 10px;
    }
    .rf-header-logo {
      width: 32px; height: 32px; border-radius: 8px;
      background: transparent;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; overflow: hidden;
    }
    .rf-header-logo img {
      width: 32px; height: 32px; object-fit: contain;
      mix-blend-mode: screen;
    }
    .rf-header-title {
      color: #fff; font-size: 14px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1px;
    }
    .rf-home-btn {
      background: none; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px;
      color: #999; font-size: 11px; font-weight: 600;
      padding: 5px 10px; cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
      display: none;
    }
    .rf-home-btn:hover {
      border-color: ${CONFIG.brandColor}; color: ${CONFIG.brandColor};
    }
    .rf-home-btn.rf-show { display: block; }

    /* ── Scrollable body ── */
    .rf-body {
      flex: 1; overflow-y: auto;
      scrollbar-width: thin; scrollbar-color: #222 transparent;
    }
    .rf-body::-webkit-scrollbar { width: 5px; }
    .rf-body::-webkit-scrollbar-track { background: transparent; }
    .rf-body::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }

    /* ── Home page ── */
    .rf-home {
      padding: 40px 24px 24px;
      display: flex; flex-direction: column;
    }
    .rf-home-heading {
      font-size: 24px; font-weight: 900; color: #fff;
      text-align: center; margin-bottom: 6px;
      text-transform: uppercase; letter-spacing: -0.5px;
    }
    .rf-home-sub {
      font-size: 13px; color: #666; text-align: center;
      margin-bottom: 32px; line-height: 1.5; padding: 0 8px;
    }

    /* ── Category cards ── */
    .rf-cats {
      display: flex; flex-direction: column; gap: 6px;
    }
    .rf-cat-card {
      display: flex; align-items: center; gap: 12px;
      background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px; padding: 14px 16px;
      cursor: pointer; transition: border-color 0.2s, background 0.2s;
    }
    .rf-cat-card:hover {
      border-color: ${CONFIG.brandColor}; background: #1e1e1e;
    }
    .rf-cat-card-icon {
      font-size: 20px; flex-shrink: 0; width: 28px; text-align: center;
    }
    .rf-cat-card-label {
      flex: 1; font-size: 14px; font-weight: 600; color: #e5e5e5;
    }
    .rf-cat-card-arrow {
      color: #444; font-size: 16px; transition: color 0.2s;
    }
    .rf-cat-card:hover .rf-cat-card-arrow { color: ${CONFIG.brandColor}; }

    /* ── Sub-questions page ── */
    .rf-subpage {
      padding: 24px;
      display: flex; flex-direction: column;
    }
    .rf-sub-back {
      background: none; border: none; color: #666;
      font-size: 12px; font-weight: 500; cursor: pointer;
      text-align: left; padding: 0 0 16px; transition: color 0.2s;
    }
    .rf-sub-back:hover { color: ${CONFIG.brandColor}; }
    .rf-sub-heading {
      font-size: 18px; font-weight: 700; color: #fff;
      margin-bottom: 16px;
    }
    .rf-sub-list {
      display: flex; flex-direction: column; gap: 6px;
    }
    .rf-sub-item {
      display: flex; align-items: center; justify-content: space-between;
      background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px; padding: 14px 16px;
      cursor: pointer; font-size: 13.5px; color: #e5e5e5;
      text-align: left; transition: border-color 0.2s, background 0.2s;
      line-height: 1.4;
    }
    .rf-sub-item:hover {
      border-color: ${CONFIG.brandColor}; background: #1e1e1e;
    }
    .rf-sub-item-arrow {
      color: #444; font-size: 14px; flex-shrink: 0; margin-left: 8px;
      transition: color 0.2s;
    }
    .rf-sub-item:hover .rf-sub-item-arrow { color: ${CONFIG.brandColor}; }

    /* ── Chat messages ── */
    .rf-chat {
      padding: 16px 16px 16px 22px; display: flex; flex-direction: column; gap: 12px;
      min-height: 100%;
    }
    .rf-msg {
      max-width: 85%; padding: 10px 16px; border-radius: 4px;
      font-size: 14px; line-height: 1.55; word-wrap: break-word; white-space: pre-wrap;
    }
    .rf-msg a { color: ${CONFIG.brandColor}; text-decoration: underline; }
    .rf-msg-bot {
      align-self: flex-start; background: #1a1a1a; color: #e5e5e5;
      border-bottom-left-radius: 4px;
    }
    .rf-msg-user {
      align-self: flex-end; background: ${CONFIG.brandColor}; color: #1a1a1a;
      border-bottom-right-radius: 4px; font-weight: 500;
    }

    /* Typing */
    .rf-typing {
      align-self: flex-start; display: flex; gap: 4px;
      padding: 12px 16px; background: #1a1a1a; border-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .rf-typing-dot {
      width: 7px; height: 7px; background: #555; border-radius: 50%;
      animation: rf-bounce 1.2s infinite;
    }
    .rf-typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .rf-typing-dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes rf-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    /* ── Input ── */
    .rf-input-area {
      padding: 12px 16px; background: #0A0A0A;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex; gap: 8px; align-items: flex-end;
    }
    .rf-input-area textarea {
      flex: 1; background: #1a1a1a; border: 1px solid #2a2a2a;
      border-radius: 4px; padding: 10px 14px; color: #e5e5e5;
      font-size: 14px; font-family: inherit; resize: none;
      outline: none; max-height: 100px; line-height: 1.4;
      transition: border-color 0.2s;
    }
    .rf-input-area textarea::placeholder { color: #555; }
    .rf-input-area textarea:focus { border-color: ${CONFIG.brandColor}; }
    .rf-send-btn {
      width: 38px; height: 38px; border-radius: 4px;
      background: ${CONFIG.brandColor}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.2s, opacity 0.2s;
    }
    .rf-send-btn:hover { background: ${CONFIG.brandColorDark}; }
    .rf-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .rf-send-btn svg { width: 18px; height: 18px; color: #1a1a1a; }

    .rf-powered {
      text-align: center; padding: 6px; background: #0A0A0A;
      font-size: 10px; color: #444;
    }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      #rf-chat-window {
        right: 0; bottom: 0; left: 0;
        top: auto;
        width: 100%;
        height: 85dvh;
        max-height: 85dvh;
        border-radius: 4px 4px 0 0;
        position: fixed;
        padding-bottom: env(safe-area-inset-bottom);
      }
      #rf-chat-bubble {
        bottom: calc(16px + env(safe-area-inset-bottom));
        right: 16px;
      }
      .rf-input-area {
        padding-bottom: calc(12px + env(safe-area-inset-bottom));
      }
    }
  `;

  // ─── Build HTML shell ────────────────────────────────────────────
  function buildWidget() {
    const c = document.createElement("div");
    c.id = "rf-chat-widget";
    c.innerHTML = `
      <div id="rf-chat-label">👋 Ask us anything</div>
      <button id="rf-chat-bubble" aria-label="Open chat">
        <svg class="rf-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <svg class="rf-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div id="rf-chat-window">
        <div class="rf-header">
          <div class="rf-header-left">
            <div class="rf-header-logo"><img src="https://resilience-chatbot.vercel.app/resilience-logo.png" alt="Resilience Fitness" /></div>
            <div class="rf-header-title">${CONFIG.title}</div>
          </div>
          <button class="rf-home-btn" id="rf-home-btn">Home</button>
        </div>
        <div class="rf-body" id="rf-body"></div>
        <div class="rf-input-area">
          <textarea id="rf-input" rows="1" placeholder="Send a message"></textarea>
          <button class="rf-send-btn" id="rf-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div class="rf-powered">Powered by Resilience Fitness</div>
      </div>
    `;
    return c;
  }

  // ─── Render: Home page ───────────────────────────────────────────
  function renderHome() {
    onHomePage = true;
    const body = document.getElementById("rf-body");
    const homeBtn = document.getElementById("rf-home-btn");
    homeBtn.classList.remove("rf-show");

    let html = '<div class="rf-home">';
    html += '<div class="rf-home-heading">How can we help?</div>';
    html += '<div class="rf-home-sub">Ask us about classes, memberships, your account — or get training and nutrition advice straight from the Resilience coaching playbook.</div>';
    html += '<div class="rf-cats">';
    CATEGORIES.forEach((cat, i) => {
      html += `<button class="rf-cat-card" data-cat="${i}">
        <span class="rf-cat-card-icon">${cat.icon}</span>
        <span class="rf-cat-card-label">${cat.label}</span>
        <span class="rf-cat-card-arrow">›</span>
      </button>`;
    });
    html += '</div></div>';
    body.innerHTML = html;

    body.querySelectorAll(".rf-cat-card").forEach((el) => {
      el.addEventListener("click", () => renderSubQuestions(parseInt(el.dataset.cat)));
    });
  }

  // ─── Render: Sub-questions page ──────────────────────────────────
  function renderSubQuestions(catIndex) {
    const cat = CATEGORIES[catIndex];
    const body = document.getElementById("rf-body");

    let html = '<div class="rf-subpage">';
    html += '<button class="rf-sub-back">← Back to topics</button>';
    html += `<div class="rf-sub-heading">${cat.icon} ${cat.label}</div>`;
    html += '<div class="rf-sub-list">';
    cat.questions.forEach((q, i) => {
      html += `<button class="rf-sub-item" data-q="${i}">
        <span>${q}</span>
        <span class="rf-sub-item-arrow">›</span>
      </button>`;
    });
    html += '</div></div>';
    body.innerHTML = html;

    body.querySelector(".rf-sub-back").addEventListener("click", renderHome);
    body.querySelectorAll(".rf-sub-item").forEach((el) => {
      el.addEventListener("click", () => {
        startChat(cat.questions[parseInt(el.dataset.q)]);
      });
    });
  }

  // ─── Render: Chat view ──────────────────────────────────────────
  function renderChatView() {
    onHomePage = false;
    const body = document.getElementById("rf-body");
    const homeBtn = document.getElementById("rf-home-btn");
    homeBtn.classList.add("rf-show");
    body.innerHTML = '<div class="rf-chat" id="rf-chat"></div>';
  }

  function startChat(question) {
    renderChatView();
    sendMessage(question);
  }

  function goHome() {
    conversationHistory = [];
    renderHome();
  }

  // ─── Message helpers ─────────────────────────────────────────────
  function formatMessage(text) {
    let html = text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    html = html.replace(
      /(?<!\href=")(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return html;
  }

  function addMessage(role, text) {
    const chat = document.getElementById("rf-chat");
    const div = document.createElement("div");
    div.className = `rf-msg rf-msg-${role}`;
    div.innerHTML = formatMessage(text);
    chat.appendChild(div);
    const body = document.getElementById("rf-body");
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function showTyping() {
    const chat = document.getElementById("rf-chat");
    const div = document.createElement("div");
    div.className = "rf-typing"; div.id = "rf-typing";
    div.innerHTML = '<div class="rf-typing-dot"></div><div class="rf-typing-dot"></div><div class="rf-typing-dot"></div>';
    chat.appendChild(div);
    const body = document.getElementById("rf-body");
    body.scrollTop = body.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById("rf-typing");
    if (el) el.remove();
  }

  // ─── Streaming API call ──────────────────────────────────────────
  async function sendMessage(userText) {
    if (isLoading || !userText.trim()) return;
    isLoading = true;

    // Switch to chat view if still on home
    if (onHomePage) renderChatView();

    const input = document.getElementById("rf-input");
    const sendBtn = document.getElementById("rf-send");
    input.disabled = true;
    sendBtn.disabled = true;

    addMessage("user", userText);
    conversationHistory.push({ role: "user", content: userText });
    showTyping();

    try {
      const response = await fetch(CONFIG.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      removeTyping();

      const botDiv = addMessage("bot", "");
      let fullText = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const event = JSON.parse(data);
            if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
              fullText += event.delta.text;
              botDiv.innerHTML = formatMessage(fullText);
              const body = document.getElementById("rf-body");
              body.scrollTop = body.scrollHeight;
            }
          } catch (e) {}
        }
      }

      if (fullText) {
        conversationHistory.push({ role: "assistant", content: fullText });
      }
    } catch (err) {
      console.error("Resilience Chat error:", err);
      removeTyping();
      addMessage("bot",
        "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach out to us directly at **contact@resiliencefitness.ca** or **437-826-9080**."
      );
    } finally {
      isLoading = false;
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // ─── Auto-resize ────────────────────────────────────────────────
  function autoResize(ta) {
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 100) + "px";
  }

  // ─── Init ────────────────────────────────────────────────────────
  function init() {
    document.head.appendChild(styles);
    document.body.appendChild(buildWidget());

    const bubble = document.getElementById("rf-chat-bubble");
    const chatWindow = document.getElementById("rf-chat-window");
    const input = document.getElementById("rf-input");
    const sendBtn = document.getElementById("rf-send");
    const homeBtn = document.getElementById("rf-home-btn");
    const chatLabel = document.getElementById("rf-chat-label");

    function dismissLabel() {
      chatLabel.classList.add("rf-label-hidden");
    }

    // Auto-dismiss label after 8 seconds
    setTimeout(dismissLabel, 8000);

    // Dismiss when label is clicked (open the chat)
    chatLabel.addEventListener("click", () => {
      dismissLabel();
      if (!isOpen) bubble.click();
    });

    // First open → render home
    let firstOpen = true;
    bubble.addEventListener("click", () => {
      isOpen = !isOpen;
      bubble.classList.toggle("rf-open", isOpen);
      chatWindow.classList.toggle("rf-visible", isOpen);
      if (isOpen) dismissLabel();
      if (isOpen && firstOpen) {
        renderHome();
        firstOpen = false;
      }
      if (isOpen) setTimeout(() => input.focus(), 300);
    });

    // Home button
    homeBtn.addEventListener("click", goHome);

    // Send
    sendBtn.addEventListener("click", () => {
      const t = input.value.trim();
      if (t) { input.value = ""; autoResize(input); sendMessage(t); }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const t = input.value.trim();
        if (t) { input.value = ""; autoResize(input); sendMessage(t); }
      }
    });

    input.addEventListener("input", () => autoResize(input));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
