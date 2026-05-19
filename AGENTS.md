# CANVION — Development Guide

Instructions for AI coding assistants and developers working on the CANVION codebase.

## Project Structure

```
canvion/
├── src/
│   ├── canvas/              # The infinite HTML canvas
│   │   ├── Canvas.tsx       # Main canvas with pan/zoom, grid, keyboard shortcuts
│   │   ├── CanvasNode.tsx   # Individual HTML node (drag, resize, edit, delete)
│   │   ├── CanvasEdges.tsx  # SVG connection lines between nodes
│   │   ├── CanvasToolbar.tsx# Human tools (left sidebar)
│   │   └── NaturalLanguageInput.tsx  # "/" command input for Brain commands
│   ├── nodes/
│   │   └── registry.ts      # Node type definitions (12 types)
│   ├── state/
│   │   └── canvas-store.ts  # Zustand store (nodes, edges, brains, events, UI)
│   ├── tools/               # Shared tool implementations (future)
│   ├── brains/              # AI Brain runtime (future)
│   │   └── personas/        # Brain persona definitions (future)
│   └── app/
│       ├── page.tsx         # Landing page
│       ├── layout.tsx       # Root layout (dark theme)
│       ├── globals.css      # Tailwind + base styles
│       └── canvas/
│           └── page.tsx     # Canvas page (dynamic import)
├── tailwind.config.js
├── postcss.config.mjs
└── package.json
```

## Key Concepts

### Canvas = HTML
Every node on the canvas is a real HTML `<div>` with absolutely positioned CSS. NOT SVG, NOT Canvas API, NOT WebGL. This is intentional — AI agents generate and read HTML natively.

### Nodes
12 types defined in `src/nodes/registry.ts`. Each has:
- `type` — unique key
- `defaultContent` — HTML string
- `defaultSize` — width/height
- `defaultStyle` — CSS properties
- `category` — content/data/media/layout/interactive

### State Management
Zustand store in `src/state/canvas-store.ts`. Single source of truth for:
- `nodes[]` — canvas nodes with position, size, content, style
- `edges[]` — connections between nodes
- `brains[]` — AI brain instances with memory
- `events[]` — action log (last 50)
- UI state (selected node, tool mode, viewport, etc.)

### Tool Modes
The canvas has different modes that change click behavior:
- `select` — click to select, drag to move
- `pan` — drag to pan the canvas
- `note/card/table/...` — click to place a new node
- `connect` — click source then target to create edge

### Pan/Zoom
CSS `transform: translate(x, y) scale(zoom)` on the canvas container. Mouse wheel zooms toward cursor. Pan with middle mouse or pan tool.

## Adding a New Node Type

1. Add entry to `NODE_TYPES` in `src/nodes/registry.ts`:
```typescript
mytype: {
  type: 'mytype',
  label: 'My Type',
  icon: '🎯',
  category: 'content',
  description: 'Description',
  defaultContent: '<div>Default HTML</div>',
  defaultSize: { width: 300, height: 200 },
  defaultStyle: { background: '#1e1e2e', borderRadius: '12px', padding: '16px' },
},
```

2. Add the mode to `ToolMode` type in `canvas-store.ts`
3. The toolbar auto-discovers from `NODE_TYPES` — no other changes needed

## Adding a Brain Persona

1. Create `src/brains/personas/architect.ts`:
```typescript
export const architectPersona = {
  name: 'Architect',
  avatar: '🏗️',
  color: '#3b82f6',
  systemPrompt: 'You are a software architect...',
  tools: ['create_node', 'create_edge', 'fetch_url'],
};
```

2. Register in Brain runtime (Phase 2)

## Commands

```bash
npm run dev          # Dev server on port 3333
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint
```

## Design Principles

1. **HTML-first** — Every visual element is DOM, not canvas primitives
2. **AI-native** — HTML is what LLMs generate best; use it
3. **Shared tools** — Human and Brains use the same tool registry
4. **Visible work** — Brain activity is always visible (cursors, status)
5. **Memory matters** — Every Brain has persistent memory
6. **Dark theme** — Default dark, always
