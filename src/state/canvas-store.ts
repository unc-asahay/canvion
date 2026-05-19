// CANVION Canvas Store — Zustand + CRDT-inspired state
// This is the single source of truth for all canvas state

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { getNodeType } from '@/nodes/registry';

// ─── Types ────────────────────────────────────────────────────────

export interface CanvasNode {
  id: string;
  type: string;           // matches NODE_TYPES key
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;        // HTML content
  style: React.CSSProperties;
  zIndex: number;
  locked: boolean;
  createdBy: 'human' | string;  // 'human' or brain id
  createdAt: number;
  updatedAt: number;
  metadata: Record<string, unknown>;
}

export interface CanvasEdge {
  id: string;
  source: string;         // node id
  target: string;         // node id
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  style?: React.CSSProperties;
  animated?: boolean;
  createdBy: 'human' | string;
}

export interface CanvasBrain {
  id: string;
  name: string;
  persona: string;
  avatar: string;
  color: string;
  status: 'idle' | 'thinking' | 'acting' | 'messaging' | 'offline';
  position: { x: number; y: number };
  currentTask?: string;
  memory: BrainMemory;
}

export interface BrainMemory {
  shortTerm: MemoryEvent[];    // last 50 events
  longTerm: MemoryEntry[];     // persistent decisions
  decisions: Decision[];
}

export interface MemoryEvent {
  id: string;
  timestamp: number;
  actor: 'human' | string;
  action: string;
  target?: string;
  detail: string;
}

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  createdAt: number;
}

export interface Decision {
  id: string;
  question: string;
  decision: string;
  decidedBy: 'human' | string;
  timestamp: number;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export type ToolMode = 'select' | 'pan' | 'note' | 'card' | 'table' | 'code' | 'chart' | 'image' | 'list' | 'section' | 'form' | 'iframe' | 'button' | 'brain' | 'connect' | 'text';

// ─── Store ────────────────────────────────────────────────────────

interface CanvasState {
  // Data
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  brains: CanvasBrain[];
  events: MemoryEvent[];

  // UI state
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  toolMode: ToolMode;
  viewport: CanvasViewport;
  isPanning: boolean;
  showBrainPanel: boolean;
  showMinimap: boolean;
  commandPaletteOpen: boolean;
  naturalLanguageInput: string;

  // Z-index counter
  nextZIndex: number;

  // ─── Node Actions ─────────────────────────────────────────────
  addNode: (type: string, position: { x: number; y: number }, createdBy?: 'human' | string, customContent?: string) => string;
  updateNode: (id: string, updates: Partial<CanvasNode>) => void;
  deleteNode: (id: string) => void;
  moveNode: (id: string, position: { x: number; y: number }) => void;
  resizeNode: (id: string, size: { width: number; height: number }) => void;
  bringToFront: (id: string) => void;

  // ─── Edge Actions ─────────────────────────────────────────────
  addEdge: (source: string, target: string, label?: string, createdBy?: 'human' | string) => string;
  updateEdge: (id: string, updates: Partial<CanvasEdge>) => void;
  deleteEdge: (id: string) => void;

  // ─── Brain Actions ────────────────────────────────────────────
  addBrain: (name: string, persona: string, avatar: string, color: string) => string;
  updateBrain: (id: string, updates: Partial<CanvasBrain>) => void;
  removeBrain: (id: string) => void;

  // ─── Event/Memory Actions ─────────────────────────────────────
  addEvent: (actor: 'human' | string, action: string, detail: string, target?: string) => void;

  // ─── UI Actions ───────────────────────────────────────────────
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  setToolMode: (mode: ToolMode) => void;
  setViewport: (viewport: Partial<CanvasViewport>) => void;
  setIsPanning: (isPanning: boolean) => void;
  toggleBrainPanel: () => void;
  toggleMinimap: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNaturalLanguageInput: (input: string) => void;
}

// ─── Implementation ───────────────────────────────────────────────

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  brains: [],
  events: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  toolMode: 'select',
  viewport: { x: 0, y: 0, zoom: 1 },
  isPanning: false,
  showBrainPanel: true,
  showMinimap: true,
  commandPaletteOpen: false,
  naturalLanguageInput: '',
  nextZIndex: 10,

  // ─── Node Actions ─────────────────────────────────────────────

  addNode: (type, position, createdBy = 'human', customContent) => {
    const typeDef = getNodeType(type);
    const id = `node_${nanoid(8)}`;
    const now = Date.now();
    const state = get();

    const node: CanvasNode = {
      id,
      type,
      position,
      size: { ...typeDef.defaultSize },
      content: customContent || typeDef.defaultContent,
      style: typeDef.defaultStyle ? { ...typeDef.defaultStyle } : {},
      zIndex: state.nextZIndex,
      locked: false,
      createdBy,
      createdAt: now,
      updatedAt: now,
      metadata: {},
    };

    set(s => ({
      nodes: [...s.nodes, node],
      nextZIndex: s.nextZIndex + 1,
    }));

    get().addEvent(createdBy, 'created', `Created ${typeDef.label}`, id);
    return id;
  },

  updateNode: (id, updates) => {
    set(s => ({
      nodes: s.nodes.map(n =>
        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
      ),
    }));
  },

  deleteNode: (id) => {
    const node = get().nodes.find(n => n.id === id);
    set(s => ({
      nodes: s.nodes.filter(n => n.id !== id),
      edges: s.edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }));
    if (node) {
      get().addEvent('human', 'deleted', `Deleted ${getNodeType(node.type).label}`, id);
    }
  },

  moveNode: (id, position) => {
    set(s => ({
      nodes: s.nodes.map(n =>
        n.id === id ? { ...n, position, updatedAt: Date.now() } : n
      ),
    }));
  },

  resizeNode: (id, size) => {
    set(s => ({
      nodes: s.nodes.map(n =>
        n.id === id ? { ...n, size, updatedAt: Date.now() } : n
      ),
    }));
  },

  bringToFront: (id) => {
    const state = get();
    set(s => ({
      nodes: s.nodes.map(n =>
        n.id === id ? { ...n, zIndex: s.nextZIndex } : n
      ),
      nextZIndex: s.nextZIndex + 1,
    }));
  },

  // ─── Edge Actions ─────────────────────────────────────────────

  addEdge: (source, target, label, createdBy = 'human') => {
    const id = `edge_${nanoid(8)}`;
    const edge: CanvasEdge = {
      id,
      source,
      target,
      label,
      animated: false,
      createdBy,
    };
    set(s => ({ edges: [...s.edges, edge] }));
    get().addEvent(createdBy, 'connected', `Connected nodes${label ? `: ${label}` : ''}`);
    return id;
  },

  updateEdge: (id, updates) => {
    set(s => ({
      edges: s.edges.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  },

  deleteEdge: (id) => {
    set(s => ({
      edges: s.edges.filter(e => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    }));
  },

  // ─── Brain Actions ────────────────────────────────────────────

  addBrain: (name, persona, avatar, color) => {
    const id = `brain_${nanoid(8)}`;
    const brain: CanvasBrain = {
      id,
      name,
      persona,
      avatar,
      color,
      status: 'idle',
      position: { x: 0, y: 0 },
      memory: {
        shortTerm: [],
        longTerm: [],
        decisions: [],
      },
    };
    set(s => ({ brains: [...s.brains, brain] }));
    return id;
  },

  updateBrain: (id, updates) => {
    set(s => ({
      brains: s.brains.map(b => b.id === id ? { ...b, ...updates } : b),
    }));
  },

  removeBrain: (id) => {
    set(s => ({
      brains: s.brains.filter(b => b.id !== id),
    }));
  },

  // ─── Event/Memory ─────────────────────────────────────────────

  addEvent: (actor, action, detail, target) => {
    const event: MemoryEvent = {
      id: `evt_${nanoid(8)}`,
      timestamp: Date.now(),
      actor,
      action,
      target,
      detail,
    };
    set(s => ({
      events: [...s.events.slice(-49), event], // keep last 50
    }));
  },

  // ─── UI Actions ───────────────────────────────────────────────

  setSelectedNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setToolMode: (mode) => set({ toolMode: mode }),
  setViewport: (viewport) => set(s => ({ viewport: { ...s.viewport, ...viewport } })),
  setIsPanning: (isPanning) => set({ isPanning }),
  toggleBrainPanel: () => set(s => ({ showBrainPanel: !s.showBrainPanel })),
  toggleMinimap: () => set(s => ({ showMinimap: !s.showMinimap })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setNaturalLanguageInput: (input) => set({ naturalLanguageInput: input }),
}));
