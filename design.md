# NUST Grants & Awards Eligibility Portal — Design System

Design specification for the NUST research publication portal. This document is the single source of truth for the app's visual language and **doubles as the conformance spec for the AI Chat Assistant widget** (see §9), which now conforms to it.

**Source of truth:** `style.css`, `index.html`, `app.js`. **Explicitly NOT derived from** `chat-widget.css` — that file was rewritten to conform to §9 and consumes the app's shared design tokens.

---

## 1. Overview & Design Principles

- **Dark-by-default slate theme** with a lighter `[data-theme="light"]` override. Variables are re-declared per theme; components never hard-code colors.
- **Glass-morphism cards** — solid slate surfaces, subtle 1px borders, backdrop blur, layered shadows.
- **Gradient brand accents** — blue is the primary CTA/identity color; cyan/purple/emerald map to the three service flows (Conference / APC / FA).
- **Typography pairing** — `Outfit` (headings, geometric, weight 700/800) + `Inter` (body, 300–700).
- **No frameworks** — vanilla HTML/CSS/JS; custom properties for theming.
- **Motion with restraint** — short cubic-bezier transitions, small translateY lifts, glow shadows on hover.

---

## 2. Design Tokens

### 2.1 Dark palette (default, `:root` — `style.css:4-36`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0f172a` (Slate 900) | Page background, input background |
| `--bg-secondary` | `#1e293b` (Slate 800) | Header/footer wash, tooltip boxes |
| `--bg-card` | `#1e293b` (Slate 800) | Card surfaces |
| `--bg-input` | `#0f172a` (Slate 900) | Inputs, option buttons |
| `--border-color` | `#334155` (Slate 700) | Borders/dividers |
| `--border-focus` | `#3b82f6` (Blue 500) | Focus rings |
| `--text-primary` | `#ffffff` | Headings, primary text |
| `--text-secondary` | `#f1f5f9` (Slate 100) | Body copy |
| `--text-muted` | `#cbd5e1` (Slate 300) | Captions, placeholders |

### 2.2 Accents & gradients (`style.css:18-26`)

| Token | Solid | Gradient |
|-------|-------|----------|
| Blue (identity/CTA) | `--accent-blue: #60a5fa` | `linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)` |
| Cyan (Conference flow) | `--accent-cyan: #22d3ee` | `linear-gradient(135deg, #0891b2 0%, #0369a1 100%)` |
| Purple (APC flow) | `--accent-purple: #c084fc` | `linear-gradient(135deg, #a855f7 0%, #6b21a8 100%)` |
| Emerald (FA flow) | `--accent-emerald: #34d399` | `linear-gradient(135deg, #10b981 0%, #065f46 100%)` |
| Red (errors/ineligible) | `--accent-red: #f87171` | — |

### 2.3 Light palette (`[data-theme="light"]` — `style.css:39-60`)

Same tokens, re-declared for contrast on light backgrounds:

| Token | Value |
|-------|-------|
| `--bg-primary` / `--bg-input` | `#f8fafc` (Slate 50) |
| `--bg-secondary` | `#f1f5f9` (Slate 100) |
| `--bg-card` | `#ffffff` |
| `--border-color` | `#cbd5e1` (Slate 300) |
| `--border-focus` | `#1d4ed8` (Blue 700) |
| `--text-primary` | `#0f172a` (Slate 900) |
| `--text-secondary` | `#1e293b` (Slate 800) |
| `--text-muted` | `#475569` (Slate 600) |
| Accents | cyan `#0891b2`, purple `#7e22ce`, emerald `#047857`, red `#b91c1c`, blue `#1d4ed8` |

### 2.4 Radius, shadow, transition (`style.css:29-35`)

| Token | Value |
|-------|-------|
| `--border-radius-sm` | 8px |
| `--border-radius-md` | 14px |
| `--border-radius-lg` | 24px |
| `--shadow-sm` | `0 2px 4px rgba(0,0,0,0.1)` |
| `--shadow-md` | `0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)` (dark) |
| `--shadow-lg` | `0 20px 40px -15px rgba(0,0,0,0.5)` (dark) |
| `--transition-smooth` | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` |

Light theme softens `--shadow-md` / `--shadow-lg` to `rgba(15, 23, 42, 0.05–0.08)` (`style.css:58-59`).

---

## 3. Typography

Fonts loaded via Google Fonts (`index.html:11-16`):

| Font | Role | Weights |
|------|------|---------|
| **Outfit** | Headings, brand, big numbers (`font-family: 'Outfit', sans-serif`) | 400–800 |
| **Inter** | Body, inputs, buttons (`font-family: 'Inter', sans-serif`) | 300–700 |

**Type scale (from component usage):**

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Hero heading | Outfit | 2.5rem | 800 |
| Section/page titles | Outfit | 1.75–2rem | 800 |
| Card title (`h3`) | Outfit | 1.4rem | 700 |
| Question text / brand | Outfit | 1.25–1.4rem | 700–800 |
| Grand total value | Outfit | 1.6rem | 800 |
| Body copy | Inter | 0.95–1.1rem | 400–600 |
| Labels / captions | Inter | 0.75–0.9rem | 400–600 |
| Badges (uppercase) | Inter | 0.75rem | 600–700 |

**Letter-spacing conventions:** badges/pills `0.05em`, brand sub-label `0.1em`, section labels `0.05em`. Headings use tight line-heights (1.1–1.35).

---

## 4. Theme Mechanism

- **Dark is the default** — tokens live on `:root`.
- The theme is applied to the `<html>` element: `document.documentElement.setAttribute('data-theme', theme)` (`app.js:324-333`).
- The light theme overrides **only the variable values** under `[data-theme="light"]`; component CSS is theme-agnostic.
- Toggled by `#theme-toggle` (`.btn-icon`) in the header (`index.html:38-40`).
- **Rule:** any new component (e.g. chat widget) must consume these shared variables so it inherits both themes automatically — no hard-coded theme colors.

---

## 5. Layout & Grid

- **Container:** `max-width: 1200px`, `margin: 0 auto`, padding `3rem 1.5rem` (`style.css:149-155`).
- **Header:** sticky, `backdrop-filter: blur(10px)`, `border-bottom: 1px solid var(--border-color)`, `z-index: 50` (`style.css:101-109`).
- **Background:** fixed `.bg-glow` radial-gradient mesh (`#3b82f6` / `#a855f7` / `#06b6d2`) behind content, `z-index: -1` (`style.css:82-98`).
- **Breakpoints:**
  - `868px` — result layout becomes 2-column (`1.1fr 0.9fr`) (`style.css:780-784`).
  - `480px` — mobile overrides: smaller hero, tighter card padding, stacked action buttons, single-column author rows (`style.css:1274-1295`).

---

## 6. Component Library

### 6.1 Cards
- **`.glass-card`** — `background: var(--bg-card)`, `backdrop-filter: blur(20px)`, `border: 1px solid var(--border-color)`, `border-radius: var(--border-radius-lg)`, `box-shadow: var(--shadow-lg)`, padding `2.5rem` (`style.css:438-446`).
- **`.service-card`** (landing) — same surface + hover `translateY(-8px)` + `--shadow-lg`; interactive cursor-glow via `--x/--y` radial overlay (`.card-glow`, `style.css:216-247`).
- **Icon wrappers** — 56px rounded boxes tinted per accent (`.card-icon-wrapper.cyan/.purple/.emerald`, `background: <accent> 10%`, `border: <accent> 20%`) (`style.css:249-278`).
- **Result icons** — 72px circles tinted red/green with a soft glow (`.result-icon-wrapper.red/.green`, `style.css:608-631`).

### 6.2 Badges & pills
- **`.badge`** — pill (`border-radius: 100px`), `background: rgba(59,130,246,0.1)`, `border: 1px solid rgba(59,130,246,0.2)`, `color: var(--accent-blue)`, uppercase, `0.75rem` (`style.css:178-190`).
- **`.flow-category-badge`** — same pill pattern in emerald for the result header (`style.css:762-771`).

### 6.3 Buttons
- **`.btn`** base — no border, `padding: 0.85rem 1.75rem`, weight 600, radius `--border-radius-md`, `--transition-smooth` (`style.css:687-699`).
- **`.btn-primary`** — `background: var(--accent-blue-gradient)`, white text, glow `box-shadow: 0 4px 15px rgba(59,130,246,0.3)`; hover `translateY(-2px)` + stronger glow (`style.css:701-711`).
- **`.btn-secondary`** — `background: var(--bg-input)`, `border: 1px solid var(--border-color)`, primary text; hover lightens (`style.css:713-723`).
- **`.btn-icon`** — 42px circle, card surface, hover `rotate(15deg)` (theme toggle) (`style.css:725-742`).
- **`.btn-back`** — transparent text button with chevron, hover slides `translateX(-4px)` (`style.css:378-394`).
- **`.btn-option`** (wizard answers) — full-width input-surface rows, `border: 1px solid var(--border-color)`, left-aligned text, arrow icon; hover blue border + `translateY(-2px)` + blue glow (`style.css:490-521`).

### 6.4 Forms & inputs
- **`.checkbox-option`** — input-surface rows with native checkbox `accent-color: var(--accent-blue)`; `.checked` state = `--border-focus` border + `rgba(59,130,246,0.05)` bg (`style.css:524-563`).
- **Text/number/select** — `background: var(--bg-input)`, `border: 1px solid var(--border-color)`, radius `--border-radius-sm`; focus = `--border-focus` border + `box-shadow: 0 0 0 2px rgba(59,130,246,0.2)` (`style.css:964-987`).
- **`.custom-slider`** — 6px track, `accent-color: var(--accent-blue)`; value bubble/input tinted `rgba(59,130,246,0.1)` (`style.css:1015-1064`).

### 6.5 Feedback & status
- **Progress bar** — 6px track (`--bg-input` + border), fill `--accent-blue-gradient`, width transition 0.4s cubic-bezier (`style.css:415-430`).
- **`.nrp-priority-banner`** — amber info strip: `border-left: 4px solid #f59e0b`, `rgba(245,158,11,…)` tint (`style.css:566-585`).
- **`.alert-info-box`** — blue info strip: `rgba(59,130,246,0.05)` bg, `rgba(59,130,246,0.2)` border, blue icon (`style.css:852-874`).
- **`.policy-clause`** — red dashed box on ineligible results (`rgba(239,68,68,…)`, `style.css:648-670`).
- **`.checklist-box`** — bordered panel with emerald check icons (`style.css:808-850`).
- **`.grand-total-box`** — blue-tinted result panel (`rgba(59,130,246,0.08)`), total value in `--accent-blue` with glow (`style.css:1167-1190`).
- **`.tooltip-modal` / `.tooltip-box`** — fixed overlay (`rgba(0,0,0,0.5)` + blur) over a glass box (`style.css:1232-1271`).

---

## 7. Motion

| Motion | Spec |
|--------|------|
| Default transition | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` |
| Hover lift | `translateY(-2px)` (buttons) / `translateY(-8px)` (cards) |
| View transition | `opacity 0.4s ease, transform 0.4s ease` (`.view.active`) |
| Entrance animation | `scaleUp` keyframe `0.3s cubic-bezier(0.34, 1.56, 0.64, 1)` (`.animate-scale`) |
| Hover glow | blue `box-shadow` strengthening + accent border |
| Icon feedback | arrow slide `translateX(4px)`, theme toggle `rotate(15deg)` |

---

## 8. Iconography

- **FontAwesome 6.4.0** via CDN (`index.html:20`).
- Icons colorize via `color: var(--accent-*)` or inherit text color; wrapped in tinted containers for status/flow identity.
- **Widget icons:** FAB uses `fa-comments`, header actions use `fa-trash-can` and `fa-xmark` (rendered via the `<i>` element — the widget's `*` reset must not override `font-family`, or the glyphs collapse to blank boxes).
- **Favicon:** inline SVG data-URI graduation-cap mark on a blue tile (`index.html:8`), so browsers don't 404 on `/favicon.ico`.

---

## 9. Chat Widget Conformance Spec

The AI Chat Assistant (`chat-widget.js` DOM, `index.html:266-268`) consumes the **app's shared variables** (§2) so it matches dark/light automatically. Its previous hard-coded green palette has been removed.

### 9.1 Variable mapping

| Widget element | Use token(s) | Rationale |
|----------------|--------------|-----------|
| `#nust-chat-fab` (58px FAB) | `var(--accent-blue-gradient)`, white icon, `var(--shadow-md)` → `--shadow-lg` on hover, scale 1.06 | FAB = primary CTA → matches `.btn-primary` identity |
| `#nust-chat-panel` | `background: var(--bg-card)`, `border: 1px solid var(--border-color)`, `border-radius: var(--border-radius-lg)`, `box-shadow: var(--shadow-lg)` | Same surface as `.glass-card` |
| `#nust-chat-header` | `background: var(--bg-secondary)`, `border-bottom: 1px solid var(--border-color)` | Neutral glass bar — matches `.glass-card` header surface |
| `#nust-chat-clear` / `#nust-chat-close` | 30px icon buttons: `background: var(--bg-input)`, `border: 1px solid var(--border-color)`, `color: var(--text-muted)`, radius 8px; hover = `--border-focus` border + `rgba(59,130,246,0.1)` bg | Identical sizing/hover; clustered right-aligned in `.nust-chat-header-actions` (6px gap) — icons: `fa-trash-can`, `fa-xmark` |
| `#nust-chat-messages` | `background: var(--bg-primary)` (dark) / `--bg-secondary`, themed custom scrollbar (thumb `--border-color`, hover `--text-muted`) | Page-level chat surface |
| `.nust-chat-msg.user` | `background: rgba(59,130,246,0.12)`, `border: 1px solid rgba(59,130,246,0.25)`, `color: var(--text-primary)`, radius `var(--border-radius-md)`, tail `3px` | Blue-tinted user bubble (identity color) |
| `.nust-chat-msg.assistant` | `background: var(--bg-input)`, `border: 1px solid var(--border-color)`, `color: var(--text-primary)` | Inverted input-surface assistant bubble |
| `.nust-chat-msg.error` | `background: rgba(239,68,68,0.1)`, `color: var(--accent-red)`, `border: 1px solid rgba(239,68,68,0.25)` | Mirrors `.result-icon-wrapper.red` tint |
| `.nust-chat-sources` | `color: var(--text-muted)`, `border-top: 1px dashed var(--border-color)`, labels `var(--text-secondary)` | Muted meta, matches policy-clause divider style |
| `.nust-chat-typing` | three bouncing dots (`width/height 6px`, `background: var(--accent-blue)`, staggered `animation-delay`) inside an input-surface bubble | Animated typing indicator — no text |
| `#nust-chat-input` | `background: var(--bg-input)`, `border: 1px solid var(--border-color)`, radius `999px`, focus `--border-focus` + blue ring | Matches `.input-wrapper` inputs + pill send |
| `#nust-chat-send` | `background: var(--accent-blue-gradient)`, white, radius `999px`; hover `translateY(-2px)` + glow; `:disabled` opacity 0.6 | Matches `.btn-primary` |

### 9.2 Text & typography

- Widget sets `font-family: 'Inter', …` on the `#nust-chat-widget` root so all text inherits Inter — Font Awesome icon elements keep their own glyph font (the `*` reset applies no `font-family`).
- Header title: Outfit 15px weight 700; subtitle: Inter 12px `--text-muted`.
- Message body: Inter 14px `line-height 1.5`.

### 9.3 Layout & positioning (widget-scoped, allowed overrides)

These are intentionally outside the app tokens because the widget is a fixed overlay:

- `#nust-chat-fab`: `position: fixed`, `right: 20px`, `bottom: 20px`, `z-index: 2147483000`.
- `#nust-chat-panel`: `position: fixed`, `right: 20px`, `bottom: 92px`, `z-index: 2147483001`, `width: 380px`, `max-width: calc(100vw - 40px)`, `height: 560px`, `max-height: calc(100vh - 120px)`.
- Mobile (`≤480px`): panel `width: calc(100vw - 20px)`, `height: 70vh`; FAB `right/bottom: 14px`.

### 9.4 Theme inheritance

Because the widget consumes the app variables, `[data-theme="light"]` is picked up automatically — no `@media`/theme-specific rules required in the widget CSS.

---

*Spec compiled from `style.css`, `index.html`, and `app.js` on 08 Aug 2026.*
