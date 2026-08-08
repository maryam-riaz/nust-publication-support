/*
 * NUST Publication Assistant — chat widget
 * ----------------------------------------
 * Bottom-right chatbot widget for the Vercel-hosted site. Talks to the
 * FastAPI backend (HF Space) via a streaming NDJSON POST /api/chat.
 *
 * Setup on your site:
 *   1. Copy chat-widget.js and chat-widget.css to your site root
 *      (e.g. /chat-widget.js and /chat-widget.css).
 *   2. Add this to your page (the JS auto-injects the stylesheet):
 *        <script src="/chat-widget.js" defer></script>
 *        <script>
 *          window.NUST_CHAT_API_URL = "https://YOUR-ORG-YOUR-SPACE.hf.space";
 *        </script>
 *      Set NUST_CHAT_API_URL BEFORE the widget script runs (defer runs
 *      after parsing, so place the config snippet above the script tag).
 */
(function () {
  "use strict";

  var API_URL = (window.NUST_CHAT_API_URL || "https://YOUR-ORG-YOUR-SPACE.hf.space")
    .replace(/\/+$/, "");

  // ---- Inject stylesheet if not already present ----
  if (!document.getElementById("nust-chat-widget-css")) {
    var link = document.createElement("link");
    link.id = "nust-chat-widget-css";
    link.rel = "stylesheet";
    link.href = "/chat-widget.css";
    document.head.appendChild(link);
  }

  // ---- Build DOM ----
  var widget = document.createElement("div");
  widget.id = "nust-chat-widget";
  widget.setAttribute("data-open", "false");
  widget.innerHTML =
    '<button id="nust-chat-fab" type="button" aria-label="Open chat"><i class="fa-solid fa-comments"></i></button>' +
    '<div id="nust-chat-panel" hidden>' +
    '  <div id="nust-chat-header">' +
    '    <div class="nust-chat-header-title">' +
    '      <strong>NUST Publication Assistant</strong>' +
    '      <small>Ask about publication policies</small>' +
    "    </div>" +
    '    <div class="nust-chat-header-actions">' +
    '      <button id="nust-chat-clear" type="button" title="Clear conversation" aria-label="Clear conversation"><i class="fa-solid fa-trash-can"></i></button>' +
    '      <button id="nust-chat-close" type="button" aria-label="Close chat"><i class="fa-solid fa-xmark"></i></button>' +
    "    </div>" +
    "  </div>" +
    '  <div id="nust-chat-messages"></div>' +
    '  <form id="nust-chat-form">' +
    '    <input id="nust-chat-input" type="text" placeholder="Ask a question..." autocomplete="off" />' +
    '    <button id="nust-chat-send" type="submit">Send</button>' +
    "  </form>" +
    "</div>";
  document.body.appendChild(widget);

  var panel = widget.querySelector("#nust-chat-panel");
  var fab = widget.querySelector("#nust-chat-fab");
  var closeBtn = widget.querySelector("#nust-chat-close");
  var clearBtn = widget.querySelector("#nust-chat-clear");
  var messagesEl = widget.querySelector("#nust-chat-messages");
  var form = widget.querySelector("#nust-chat-form");
  var input = widget.querySelector("#nust-chat-input");
  var sendBtn = widget.querySelector("#nust-chat-send");

  // Conversation history sent with each request (the API is stateless).
  var history = [];
  var streaming = false;

  // ---- Tiny markdown-lite formatter (escape + bold/bullets/code) ----
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatAnswer(text) {
    var out = escapeHtml(text);
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/^[-*]\s+/gm, "\u2022 "); // bullet markers
    out = out.replace(/\n/g, "<br/>");
    return out;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(role, content) {
    var el = document.createElement("div");
    el.className = "nust-chat-msg " + role;
    el.innerHTML = formatAnswer(content);
    messagesEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function addTyping() {
    var el = document.createElement("div");
    el.className = "nust-chat-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function renderSources(el, sources) {
    if (!sources || sources.length === 0) return;
    var box = document.createElement("div");
    box.className = "nust-chat-sources";
    box.innerHTML =
      "<strong>" +
      (sources.length === 1 ? "Source: " : "Sources: ") +
      "</strong>" +
      escapeHtml(sources.join(", "));
    el.appendChild(box);
    scrollToBottom();
  }

  // ---- Streaming NDJSON reader ----
  async function sendQuestion(question) {
    streaming = true;
    sendBtn.disabled = true;
    input.disabled = true;

    history.push({ role: "user", content: question });
    addMessage("user", question);
    var typing = addTyping();

    try {
      var res = await fetch(API_URL + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, history: history.slice(0, -1) }),
      });

      if (!res.ok) throw new Error("Request failed with status " + res.status);

      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer = "";
      var answerEl = null;
      var answerText = "";
      var sources = null;

      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });

        var nl = buffer.indexOf("\n");
        while (nl !== -1) {
          var line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line) {
            nl = buffer.indexOf("\n");
            continue;
          }

          var ev = JSON.parse(line);

          if (ev.token !== undefined) {
            if (answerEl === null) {
              typing.remove();
              answerEl = addMessage("assistant", "");
              answerEl.innerHTML = "";
            }
            answerText += ev.token;
            answerEl.innerHTML = formatAnswer(answerText);
            scrollToBottom();
          } else if (ev.sources !== undefined) {
            sources = ev.sources;
          } else if (ev.error !== undefined) {
            throw new Error(ev.error);
          }

          nl = buffer.indexOf("\n");
        }
      }

      if (answerEl === null) {
        // Nothing streamed — surface the raw "not enough info" or empty reply.
        typing.remove();
        answerEl = addMessage("assistant", "I could not generate an answer. Please try again.");
        answerText = answerEl.textContent;
      }

      renderSources(answerEl, sources);
      history.push({ role: "assistant", content: answerText });
    } catch (err) {
      typing.remove();
      addMessage("error", "Something went wrong: " + err.message);
    } finally {
      streaming = false;
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  // ---- Events ----
  fab.addEventListener("click", function () {
    widget.setAttribute("data-open", "true");
    panel.hidden = false;
    input.focus();
  });

  closeBtn.addEventListener("click", function () {
    panel.hidden = true;
    widget.setAttribute("data-open", "false");
  });

  clearBtn.addEventListener("click", function () {
    if (!streaming) {
      history = [];
      messagesEl.innerHTML = "";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q || streaming) return;
    input.value = "";
    sendQuestion(q);
  });

  // Wake the backend on page load so the first message isn't delayed by
  // a cold start (Render free tier spins down after ~15 min idle).
  fetch(API_URL + "/health").catch(function () {});
})();
