<div align="center">

# ✦ CANVION

### **The Canvas Where Minds Collaborate**
### AI Brains and humans building together on an infinite HTML canvas.

[![Status](https://img.shields.io/badge/status-alpha-orange)](https://github.com/unc-asahay/canvion)
[![License](https://img.shields.io/badge/license-Apache_2.0-blue)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-Next.js_16_%7C_Zustand_%7C_HTML_Canvas-black)](#tech-stack)
[![Numerology](https://img.shields.io/badge/numerology-33_Master_Teacher-purple)](#numerology)

---

</div>

## The Vision

Every AI diagramming tool today does the same thing: you type a prompt, it dumps a finished diagram. One LLM call, one artifact, one black box.

**CANVION inverts that.** A team of AI Brains physically build the diagram on a shared HTML canvas — cursors fly between zones, status pills show who's thinking, work happens step-by-step in front of you. You watch the system reason. You jump in to redirect. You drag, edit, override at any time.

But here's what makes CANVION fundamentally different: **the canvas is HTML, not pixels.**

## Why HTML Canvas?

| Aspect | FigJam / Miro (Canvas/WebGL) | CANVION (HTML) |
|--------|----------------------------|----------------|
| AI generates it | ❌ SVG coords, unnatural | ✅ HTML is LLMs' native language |
| AI reads it | ❌ Needs vision model | ✅ DOM query, semantic structure |
| Interactive | ❌ Just pixels | ✅ Forms, buttons, iframes, video |
| Styling | ❌ Manual drawing | ✅ CSS — themes, animations, responsive |
| Debuggable | ❌ Screenshot + guess | ✅ DevTools, console, inspection |
| Extensible | ❌ Plugin sandbox | ✅ Any web component/library |
| Exportable | PNG/PDF only | Live HTML, deployable anywhere |

## What Makes It Unique

- **🧠 Multiple AI Brains** — Specialist agents with distinct personas, persistent memory, and tools
- **👁️ Visible Work** — Watch Brains think and build in real-time. Cursors move, status pills pulse
- **🤝 True Collaboration** — Human and AI share the same canvas with the same tools
- **🏗️ HTML-Native** — Every node is real HTML: tables, forms, charts, code blocks, iframes
- **⚡ Tool Spawning** — Brains can fetch URLs, generate images, render charts, search icons
- **💾 Git-Versioned** — Every save is a commit. Full version history
- **🔮 Numerologically Aligned** — CANVION = 33 (Master Teacher)

## Canvas Nodes (12 Types)

| Node | Icon | What it does |
|------|------|-------------|
| Sticky Note | 📝 | Quick notes and ideas |
| Card | 🃏 | Rich content with title and body |
| Table | 📊 | HTML tables for structured data |
| Code Block | 💻 | Syntax-highlighted code snippets |
| Chart | 📈 | Data visualization (ECharts) |
| Image | 🖼️ | Images or AI-generated visuals |
| List | 📋 | Checklists and bullet lists |
| Section | 📐 | Group containers / dividers |
| Form | 📝 | Interactive forms with inputs |
| Embed | 🌐 | Embedded iframes and widgets |
| Button | 🔘 | Clickable action buttons |
| Brain Card | 🧠 | AI Brain status/activity cards |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `V` | Select mode |
| `H` | Pan mode |
| `C` | Connect mode |
| `/` | Open natural language input |
| `ESC` | Cancel / deselect |
| `+` / `-` | Zoom in / out |
| `0` | Reset zoom |
| `Delete` | Delete selected node |

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 16 + React 19 | Modern primitives, edge-ready |
| State | Zustand | Lightweight, reactive, no boilerplate |
| Canvas | HTML + CSS transform | DOM-native, AI-friendly |
| Edges | SVG overlay | Only connections need SVG |
| Styling | Tailwind CSS 3 | Utility-first, dark theme |
| Brain Runtime | Server-side processes | Persistent, tool-calling loops |
| LLM | Model-agnostic | Swap providers freely |

## Architecture

```
┌──────────────────────────────────────────────────┐
│           INFINITE CANVAS (HTML)                  │
│                                                   │
│  ┌─────────────┐    ┌─────────────┐             │
│  │ <div> node   │    │ <div> node   │             │
│  │ position:    │    │ position:    │             │
│  │ absolute     │◄───│ absolute     │  SVG edges  │
│  │              │    │              │  only for   │
│  │ Contains:    │    │ Contains:    │  connections│
│  │ - HTML card  │    │ - chart      │             │
│  │ - buttons    │    │ - table      │             │
│  │ - form       │    │ - code block │             │
│  │ - anything!  │    │ - iframe     │             │
│  └─────────────┘    └─────────────┘             │
│         ↑                    ↑                    │
│    Human dragged        Brain created             │
│    this here            this via tool              │
│                                                   │
│  Pan/Zoom: CSS transform: scale() translate()    │
│  State: Zustand store (CRDT-ready)               │
│  Virtualization: render only visible nodes        │
└──────────────────────────────────────────────────┘
```

## Running Locally

```bash
git clone https://github.com/unc-asahay/canvion.git
cd canvion
npm install
npm run dev
```

Open http://localhost:3333. Press `/` to talk to the Brains.

## Roadmap

### Phase 1 — Canvas Foundation ✅
- [x] Infinite HTML canvas with pan/zoom
- [x] 12 node types (all HTML-native)
- [x] SVG edge connections
- [x] Natural language input
- [x] Keyboard shortcuts
- [x] Minimap

### Phase 2 — Brain Runtime
- [ ] Persistent Brain processes (observe → think → act loop)
- [ ] Per-Brain memory (short-term + long-term)
- [ ] Tool registry (canvas tools, content generators, external tools)
- [ ] Brain-to-Brain messaging
- [ ] Human intent capture (semantic events)

### Phase 3 — Collaboration
- [ ] Yjs CRDT for real-time sync
- [ ] Multi-user presence (cursors, selections)
- [ ] WebSocket signaling server
- [ ] Conflict resolution

### Phase 4 — Intelligence
- [ ] Brain personas (Architect, Data, Reviewer, etc.)
- [ ] Capability-based task routing
- [ ] Shared knowledge graph
- [ ] Decision tracking

### Phase 5 — Production
- [ ] Save/load to GitHub
- [ ] Version history
- [ ] Templates
- [ ] Export (HTML, PDF, PNG)
- [ ] Enterprise (SSO, audit logs)

## Numerology

**CANVION = 33** (Master Teacher)

```
C=3 → A=1 → N=5 → V=4 → I=9 → O=6 → N=5 = 33
```

33 is the rarest master number in numerology — compassion, healing, creative uplift. A platform that doesn't just build — it teaches you to build better.

## Contact

For investor / partnership conversations: **unrivalednetworkcorp@gmail.com**

For technical / contribution questions: open an issue or PR on this repo.

---

<div align="center">

*Built in the open. The canvas is the war room.* ✦

</div>
