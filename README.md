# Loopable8 Product Website

Full production-style website for Loopable8 (the AI coding assistant built from `../genesis`). Static HTML/CSS/JS — no build step, deployable to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Run locally

```
npx http-server loopable8-website -p 4173
```

(or the `loopable8-website` config in `D:\Genesis\.claude\launch.json`)

## Design system

- **Aesthetic**: dark rounded shell floating on a textured light page (Agent-AI template style from 21st.dev), monochrome palette + warm amber micro-accent
- **Themes**: dark (default) + light, toggle in nav, persisted in `localStorage`, respects `prefers-color-scheme`
- **Fonts**: Inter (UI) / JetBrains Mono (code)
- **Tokens**: CSS variables in `css/style.css`; light theme via `html[data-theme="light"]`

## Pages (16)

| Page | Notes |
|------|-------|
| `index.html` | Home — hero + IDE mockup, ecosystem coming-soon cards, CTA |
| `features.html` | Feature deep-dive + roadmap (`#roadmap`) |
| `download.html` | Windows live; macOS/Linux "notify me" forms; release history |
| `pricing.html` | Free & Pro, comparison table, pricing FAQ |
| `docs.html` | Sidebar docs with search filter + scroll spy |
| `blog.html` | Featured + grid, 4 full articles with anchors |
| `changelog.html` | Release timeline v1.0.0 → v1.4.0 |
| `about.html` | Story, principles, stats, values |
| `faq.html` | Categorized accordions + FAQPage JSON-LD |
| `contact.html` | Validated form (localStorage demo) + channels |
| `privacy.html` / `terms.html` / `cookies.html` / `license.html` | Legal set |
| `signin.html` / `signup.html` | Demo auth (localStorage only, plainly labeled) |
| `dashboard.html` | Guarded; license key, products, releases, settings |
| `404.html` | Not-found page |

## Architecture

- `js/layout.js` — injects nav/footer/cookie banner on every page (single source of truth), theme toggle, scroll reveal, FAQ accordions, newsletter forms, shared release data (`LO8.releases`)
- `js/auth.js` — demo account system (signup/signin/signout/dashboard/contact form). Accounts live only in the browser's localStorage; every auth page states this. Replace with real auth at launch.
- Page identity via `<body data-page="...">` → active nav state
- SEO: unique title/description/OG per page, canonical URLs, JSON-LD (SoftwareApplication on home, FAQPage on FAQ), `sitemap.xml`, `robots.txt`
- A11y: skip links, focus-visible styles, aria labels/expanded states, reduced-motion support

## Positioning rule

AI Coding Assistant = the shipped product. AI Chat, AI Studio (image/video/voice) and the AI-native Game Dev Studio are **Coming Soon** — polished sections, honest ETAs, never fake buttons.
