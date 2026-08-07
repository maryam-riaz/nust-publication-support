# Grants and Awards Eligibility Portal

Developed as part of an internship project for the **DD Research Publication** at **NUST Research, Innovation & Commercialization (RIC)**.

## Overview

A single-page application that helps NUST faculty and students determine eligibility for three types of research sponsorship and awards:

- **Conference Sponsorship** (WP#68) — Travel grants and registration fee sponsorship for paper presentation in international conferences.
- **APC Sponsorship** (WP#66) — Article Processing Charges (APC) sponsorship for research papers accepted in Q1/Q2 journals.
- **Financial Award** (WP#65) — Cash financial awards for research papers published in Q1, Q2, or Q3 journals.

## Tech Stack

Vanilla JavaScript (ES6), CSS3 custom properties (dark/light themes), HTML5 semantic markup. No frameworks or build tools required. The AI Chat Assistant is a self-contained vanilla JS widget that talks to a hosted RAG API.

## Features

- Eligibility wizard with guided question flow and progress stepper
- Real-time grant and award calculators with author share splitting
- Maximum funding limit enforcement
- Journal percentile-based award calculation (FA)
- School-based eligibility filtering for Q3 (NLS/NSHS only)
- Dark and light mode toggle
- Mobile-responsive layout
- Policy reference links to official working papers
- AI Chat Assistant — bottom-right chatbot that answers policy questions with streaming responses and source citations

## Policy Framework

All three policies were approved at the **73rd ACM held on 9th February 2026**. These are the latest versions and take precedence over any earlier policies (WP#40, WP#70, etc.).

| Area | WP# | Approval Date |
|------|-----|---------------|
| Conference Sponsorship | WP#68 | 73rd ACM, 09 Feb 2026 |
| APC Sponsorship | WP#66 | 73rd ACM, 09 Feb 2026 |
| Financial Award | WP#65 | 73rd ACM, 09 Feb 2026 |

## Project Structure

```
├── index.html      — 3-view SPA (landing, wizard, result/calculator)
├── app.js          — State machine, question database, eligibility logic, calculator engines
├── style.css       — Design system with dark/light mode, responsive layout, animations
├── chat-widget.js  — AI Chat Assistant widget (auto-injects its stylesheet)
├── chat-widget.css — Styles for the chat widget (bottom-right bubble/panel)
├── context.md      — Full policy context and architecture documentation
└── README.md       — This file
```

## Chat Assistant

A bottom-right chatbot widget (backed by a hosted RAG API) that answers questions about NUST publication policies. The widget is plain vanilla JS and CSS — no framework, no build step.

- **Widget files:** `chat-widget.js` (auto-injects `chat-widget.css`) — only the JS needs a script tag.
- **Wiring:** `index.html` sets `window.NUST_CHAT_API_URL` before loading `<script src="/chat-widget.js" defer>`.
- **API:** `POST /api/chat` accepts `{ question, history }` and returns a streaming `application/x-ndjson` response (token/done/sources/error events). A fire-and-forget `GET /health` pings the backend on page load to avoid cold-start delay.
- **Stateless:** the accumulated message history is sent with every request, so follow-ups work automatically.
- **No API keys in the browser:** the LLM (Groq) key lives only on the backend.
- **CORS:** the API allows requests from `https://nust-publication-support.vercel.app` and `http://localhost:3000`.

## Local Development

No build step required. Open `index.html` directly in any modern browser:

```bash
open index.html
# or
start index.html
```

> Note: to use the **Chat Assistant** locally, serve the folder rather than opening the file directly, since the API's CORS allows `http://localhost:3000` (not `file://`):

```bash
npx http-server -p 3000
# then visit http://localhost:3000
```

## Deployment

Deployed on Vercel at [nust-publication-support.vercel.app](https://nust-publication-support.vercel.app). Pushes to the `main` branch on GitHub trigger automatic deployments.
