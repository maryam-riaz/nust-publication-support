# NUST Research & Publications Eligibility Portal — Context Document

## 1. Project Overview

A single-page vanilla JS application that helps NUST faculty and students determine their eligibility for three types of research sponsorship/awards. Built with plain HTML/CSS/JS, deployed on Vercel.

**Tech stack:** Vanilla JavaScript (ES6), CSS3 custom properties (dark/light themes), HTML5 semantic markup. No frameworks or build tools. The AI Chat Assistant is a self-contained vanilla JS widget that talks to a hosted RAG API.

**Source files:**
- `index.html` — 3-view SPA (landing, wizard/stepper, result/calculator)
- `app.js` (~1221 lines) — state machine, question database, eligibility logic, calculator engines
- `style.css` (~1295 lines) — design system with dark/light mode, responsive grid, animations
- `chat-widget.js` (~233 lines) — AI Chat Assistant widget (IIFE, auto-injects stylesheet)
- `chat-widget.css` (~366 lines) — chat widget styling (bottom-right bubble/panel)

---

## 2. Policy Framework — Governing Working Papers

All three policies were approved at the **73rd ACM held on 9th February 2026**. These are the latest versions and take precedence over any earlier policies (e.g., WP#40, WP#70).

| Area | WP# | Full Title | Key Sections |
|------|-----|-----------|--------------|
| Conference Sponsorship | WP#68 | NUST Sponsorship for Paper Presentation in International Conferences | §3 (Eligibility), §4 (Conference Standing), §5 (Paper Eligibility), §6 (Submission), §7 (Funding Ceilings) |
| APC Sponsorship | WP#66 | Policy for Publication Charges | §2 (Publication Charges Rules) |
| Financial Award | WP#65 | Financial Award for Publication | §3 (Financial Award Rules) |

**Overlap rule:** One paper cannot claim both APC sponsorship **and** a Financial Award. The app enforces this via affirmations (APC aff_no_fa, FA aff_no_apc_fa).

---

## 3. Conference Sponsorship (WP#68) — Full Policy Detail

### 3.1 Applicant Eligibility (§3)

| Criteria | Rule | Code Ref |
|----------|------|----------|
| **Faculty** | Regular, >=6 months service, valid contract | `role: 'faculty'` |
| **PhD Scholars** | Bonafide, in research phase, thesis-related paper | `role: 'phd'` |
| **MS Students** | Registration fee only — max USD 700 | `role: 'ms'` with special note |
| **Non-faculty/Others** | Not eligible from central travel funds | `role: 'other'` → ineligible |
| **Campus Presence** | Must be actively serving at NUST campus; those on EOL, Study Leave, ex-Pakistan Leave, or abroad on sponsored programs are ineligible | Question `serving` |
| **No duplicate project funding** | If applicant has an active project with "International Travel for Conference" budget head, must use project funds first | Question `project_fund` |

### 3.2 Authorship Rule (§3.f)

- Only the **first author** is eligible for travel sponsorship.
- Exception: If first author is ineligible/unable to present due to exceptional circumstances beyond their control, the **supervisor** or **corresponding author** may be sponsored.
- Code implements this as `authorship` question with options for first author, supervisor/corresponding author (with exception), and co-author (ineligible).

### 3.3 Frequency Limit (§3.h–i)

- **Travel Grant:** Once per fiscal year.
- **Second travel grant** in same fiscal year allowed only if the applicant has published **2x WoS-Q1 papers** OR **1x WoS-Q1 paper + 1 approved project >= PKR 2.0M** after the previous sponsored conference.
- **Best Performer exception (§3.i):** Winners of University Best Researcher, Best Innovator, or Best Teacher are exempt from the above requirement.
- **Registration fee only:** Multiple requests in the same fiscal year can be considered without the above restrictions.

### 3.4 Conference Standing (§4)

| Criteria | Requirement |
|----------|-------------|
| **Host/Organizer** | Top conference organized/co-hosted/technically sponsored by leading professional body (IEEE, ACM, AAAS, AEA, etc.) |
| **Maturity** | >= 10th edition (cardinality not less than 10) |
| **Acceptance Rate** | < 40%. If unavailable, use CORE A/A*, ABS 4/4*, or ABDC A/A* rankings |
| **Indexing** | Proceedings indexed in Scopus or WoS CPCI (or will be published in indexed journal) |
| **Predatory Organizers** | Blacklisted: Conference Series LLC, BIT Congress, SAI, OMICS, WASET, ISER. Beall's List must be consulted |

### 3.5 Paper Eligibility (§5)

- Full-length article accepted for **Oral Presentation** after peer review
- Abstracts, poster presentations, keynote speeches, and attendance-only are **not eligible**
- Primary professional affiliation must show NUST
- Partially externally-funded applicants eligible for remaining NUST sponsorship

### 3.6 Submission Process & Lead Time (§6)

1. Must first apply to **HEC & PSF** for travel grant before NUST sponsorship
2. HEC/PSF case docs must reach Research Dte **65 days** before event (for Pro-Rector endorsement)
3. NUST sponsorship case via **eMinute Sheet** with application form + supporting docs — also **65 days** before event
4. Conference paper must be uploaded on **NRP** before processing
5. Domestic conference sponsorship approved by institutional heads from school/college budget

### 3.7 Funding Ceilings (§7)

| Component | Limit |
|-----------|-------|
| **Registration Fee Only** (no travel) | Max USD 700 |
| **Airfare** | Lowest of 3 quotations |
| **Registration Fee** (with travel grant) | Max USD 500 |
| **TA/DA** | As per Government Rules, max 5 days |
| **Visa Fee** | Single entry, as per actual |

### 3.8 Post-Travel (§8)

- Submit **Post Visit Report (Appendix 3)** via institution
- Reimbursement claim to Research Dte within **10 days** of return with original boarding passes, receipts

### 3.9 Approval Authority (§9.b)

- International travel grants: **Rector NUST**
- Registration fee only: **Pro-Rector (RIC)**
- **Ex-post facto approval** not entertained

---

## 4. APC Sponsorship (WP#66) — Full Policy Detail

### 4.1 Eligibility Rules

| Criteria | Rule |
|----------|------|
| **Journal Quartile** | Only WoS JCR Q1 or Q2. ESCI, Q3, Q4, unindexed ineligible |
| **Q2 Cap** | Only 1 Q2 case per faculty per fiscal year |
| **Paper Type** | Full-length research article or review article only. Short communications, letters, editorials, comments ineligible |
| **Timing** | Case must be sent within **3 months** of acceptance date |
| **Lead Time** | At least **4 weeks** before payment due date |
| **Invoice** | Must be in the name of the NUST author |
| **NRP Upload** | Paper must be on NUST Research Portal before processing |

### 4.2 Administrative Affirmations

1. Primary affiliation with NUST shown on the paper
2. Journal invoice issued in NUST author's name
3. Paper uploaded/approved on NRP before submission
4. Applicant understands APC + FA cannot both be claimed for same paper

### 4.3 APC Grant Calculator (from app.js)

| Parameter | Value |
|-----------|-------|
| Q1 limit | USD $1,800 |
| Q2 limit | USD $1,200 |
| Author share tables | [100], [60,40], [50,35,15], [45,30,15,10] (for 1,2,3,4+ authors) |
| Corresponding author repositioning | If NUST corresponding author is beyond index 4, moved to index 1 (2nd author position) |
| NUST share | Sum of share percentages of all NUST authors |
| NUST amount | `min(actualFee, quartileLimit) × (nustPercentage / 100)` |

---

## 5. Financial Award (WP#65) — Full Policy Detail

### 5.1 Eligibility Rules

| Criteria | Rule |
|----------|------|
| **Journal Quartile** | WoS JCR Q1, Q2, or Q3 only. Q4, ESCI, unindexed ineligible |
| **Paper Type** | Full-length research article or review article only. Letters, editorials, abstracts, comments, errata, book chapters, conference proceedings ineligible |
| **Timing** | Case must be submitted within **12 weeks** of print publication date (volume + issue numbers assigned) |
| **NUST Affiliation** | Must read "National University of Sciences and Technology (NUST), Islamabad, Pakistan" |
| **NRP** | Publication must be uploaded and approved on NUST Research Portal |
| **No double-dipping** | Cannot claim FA if APC was claimed for same paper |

### 5.2 FA Award Calculator (from app.js)

**Base Award Formula (quartile-specific constants, `app.js:1062-1081`):**

```
baseAward = formulaBase + formulaMultiplier × (TJ − PJ) / (TJ − 1)
```

| Quartile | formulaBase | formulaMultiplier | Award Range |
|----------|-------------|-------------------|-------------|
| **Q1** | Rs. 40,000 | Rs. 60,000 | Rs. 40,000 (worst) – Rs. 100,000 (best) |
| **Q2** | Rs. 35,000 | Rs. 20,000 | Rs. 35,000 (worst) – Rs. 55,000 (best) |
| **Q3** | Rs. 20,000 | Rs. 5,000 | Rs. 20,000 (worst) – Rs. 25,000 (best) |

If `TJ = 1`, the multiplier is added in full (`baseAward = formulaBase + formulaMultiplier`).

Where:
- **TJ** = Total number of journals in the WoS JCR category (2–250)
- **PJ** = Journal's position rank in that category (1 = best)

**Percentile overrides (`app.js:1083-1096`):**
- Percentile ≥ 95 → fixed award of **Rs. 150,000**
- Percentile 90–94 → base award **capped at Rs. 120,000**

**Author share tables:** [100], [60,40], [50,35,15], [45,30,15,10].

**Corresponding author repositioning:** If NUST corresponding author is beyond index 2, moved to index 1 (2nd author position) — **stricter than APC** (which uses threshold 4).

**NUST amount:** `baseAward × (nustPercentage / 100)`.

---

## 6. Overlapping / Conflicting Rules

| Conflict | Resolution | Source |
|----------|-----------|--------|
| APC vs FA for same paper | **Mutually exclusive.** Faculty cannot claim both APC sponsorship and Financial Award for the same publication | Code affirmations (both flows) |
| Earlier policies vs these | **73rd ACM (Feb 2026) policies take precedence** over WP#40, WP#70, etc. | Policy header notes |
| Q2 limit vs general APC | Only 1 Q2 case per faculty per fiscal year, regardless of other eligibility | WP#66 + code |
| Conference 2nd travel (with exceptions) | Standard rule = 1/yr; 2nd allowed only with exceptional publication output | WP#68 §3.h |
| Registration fee only multiplicity | Exempt from once-per-year rule — multiple requests allowed | WP#68 §3.h |
| HEC TGPR vs NUST policy | Applicant must apply to HEC/PSF **first**; NUST sponsors remainder or if external funding denied | WP#68 §6.a |

---

## 7. Project Architecture

### 7.1 View Structure (`index.html`)

- **`#landing-view`** — 3 service cards (Conference, APC, FA) + quick policy links
- **`#wizard-view`** — Stepper UI with progress bar, question card, ineligible card
- **`#result-view`** — Eligibility result with next-steps checklist + optional calculator panel

### 7.2 Application State (`app.js`)

```js
state: {
    currentFlow: null,       // 'conference' | 'apc' | 'fa'
    currentStep: 0,
    answers: {},            // { questionId: selectedValue }
    activeQuestions: [],    // questions array for current flow
    history: []             // navigation stack for back button
}
```

### 7.3 Question Database

| Flow | Questions | Affirmations | Calculator |
|------|-----------|--------------|------------|
| **Conference** | 13 questions (role → serving → authorship → project_fund → prior_sponsorship → performance_exemption → maturity → acceptance → ranking → indexing → predatory → paper_type → lead_time) | No | No (static checklist only) |
| **APC** | 6 questions (quartile → q2_limit → paper_type → timing → lead_time → affirmations) | Yes (4 checkboxes) | Yes (APC Grant Calculator) |
| **FA** | 4 questions (quartile → paper_type → timing → affirmations) | Yes (3 checkboxes) | Yes (FA Award Calculator) |

### 7.4 Styling System (`style.css`)

- **CSS custom properties** for theming (dark/light)
- Dark: `--bg-primary: #0f172a`, Light: `--bg-primary: #f8fafc`
- Responsive grid (1 column mobile, 2 column result view at 868px+)
- Glass-morphism cards, gradient accents, progress bar, slider controls
- Animations: scale-up on results, hover glow on cards, progress bar transitions

### 7.5 AI Chat Assistant Widget (`chat-widget.js` + `chat-widget.css`)

A bottom-right chatbot that answers questions about NUST publication policies. It is a self-contained vanilla JS IIFE — no framework, no build step. Talks to a **hosted RAG API**; no backend work on the Vercel side, and no API keys live in the browser.

- **Wiring (`index.html`):** `window.NUST_CHAT_API_URL` is set before `<script src="/chat-widget.js" defer>` runs. The widget reads the variable at load time and auto-injects `/chat-widget.css`.
- **API base URL:** `https://nust-rag-chatbot-api.onrender.com`
- **Health wake ping:** on page load, a fire-and-forget `GET /health` wakes Render's free tier (which sleeps after ~15 min idle; the first request after wake may take up to ~1 min).
- **Chat protocol:** `POST /api/chat` with body `{"question", "history"}`. Response is streaming `application/x-ndjson` (one JSON object per line):
  - `{"token": "…"}` — repeated; concatenated to build the answer.
  - `{"done": true, "sources": ["Financial Award for Publication.docx"]}` — final event; `sources` may be `[]`.
  - `{"error": "…"}` — terminal failure (no `done` follows).
  - Greetings/gibberish get canned replies; questions with no policy match return a "not enough information" message with empty sources.
- **Stateless:** the accumulated message history is sent with every request, so follow-ups work automatically. The Clear button resets the local conversation.
- **Design conformance:** the widget is restyled to match the app's design system (per `design.md` §9). It consumes the app's shared CSS variables — blue-gradient FAB (`fa-comments`), glass card panel, neutral `--bg-secondary` header, identical 30px icon-button clear/close (`fa-trash-can` / `fa-xmark`), blue-tinted user + input-surface assistant bubbles, animated typing dots — so it inherits dark/light automatically with no hard-coded theme colors. `index.html` also declares an inline SVG favicon (line 8) to prevent a `/favicon.ico` 404.
- **CORS:** the API allows `https://nust-publication-support.vercel.app` and `http://localhost:3000`. To test locally, serve the folder (e.g. `npx http-server -p 3000 -c-1`) rather than opening `file://`.
- **Security:** the Groq/LLM key lives only on the Render backend — never in the browser or this repo.

---

## 8. Discrepancies / Gaps Between Code and Policy

| Policy Rule | In Code? | Notes |
|-------------|----------|-------|
| Same conference: only 1 full travel grant + up to 3 reg-only per event | **Missing** | WP#68 §3.g — not implemented in questions |
| Domestic conference: approved by institutional heads from school budget | **Missing** | App only handles international flow |
| HEC/PSF external application required first | **Missing** | Not enforced in question flow; mentioned only in result checklist |
| Post-travel report within 10 days | **Missing** | Mentioned in checklist but not tracked |
| Turnitin report (<15% similarity) required | **Missing** | Mentioned in checklist but not a question |
| Partially-funded applicants eligible for remainder | **Missing** | Not implemented |
| Ex-post facto approval not entertained | **Missing** | Not mentioned |
| FA: only Q1-Q3 (code asks Q1/Q2/Q3 as one option) | ✅ Present | Code combines Q1/Q2/Q3 into single option — correct per policy |
| APC: Q1 limit $1,800, Q2 limit $1,200 | ✅ Present | Matches policy |
| FA formula: Q1 `40000 + 60000 × (TJ-PJ)/(TJ-1)` | ✅ Present | Implemented in `updateFACalculation()` (`app.js:1024`) |
| Author share split tables | ✅ Present | `calculateAuthorShares()` — [100], [60,40], [50,35,15], [45,30,15,10] |
| Corr. author repositioning (FA: threshold 2, APC: threshold 4) | ✅ Present | `threshold = flow === 'fa' ? 2 : 4` |
| No double-dipping APC + FA | ✅ Present | Mutual affirmations in both flows |

---

## 9. Key File Line References

| Component | File | Lines |
|-----------|------|-------|
| Question DB — Conference | `app.js` | 18–143 |
| Question DB — APC | `app.js` | 145–206 |
| Question DB — FA | `app.js` | 207–248 |
| Eligibility evaluation | `app.js` | 552–635 |
| APC Calculator (setup + calc) | `app.js` | 639–850 |
| FA Calculator (setup + calc) | `app.js` | 853–1155 |
| Author share computation | `app.js` | 1156–1215 |
| Chat widget JS (IIFE) | `chat-widget.js` | 1–233 |
| Chat widget CSS | `chat-widget.css` | 1–366 |
| Design system (variables) | `style.css` | 1–60 |
| Landing cards grid | `style.css` | 208–318 |
| Wizard/stepper | `style.css` | 370–520 |
| Result & calculator layout | `style.css` | 754–1131 |

---

*Document generated from the source code (`app.js`, `index.html`, `style.css`, `chat-widget.js`) and the official policy working papers: WP#68 (73rd ACM, 09 Feb 2026), WP#66 (73rd ACM, 09 Feb 2026), and WP#65 (73rd ACM, 09 Feb 2026).*
