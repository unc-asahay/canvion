'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/state/canvas-store';
import CanvasNodeComponent from './CanvasNode';
import CanvasEdges from './CanvasEdges';
import CanvasToolbar from './CanvasToolbar';
import NaturalLanguageInput from './NaturalLanguageInput';

export default function Canvas() {
  const {
    nodes, edges, brains, viewport, setViewport,
    toolMode, setToolMode, addNode, selectedNodeId,
    setSelectedNode, isPanning, setIsPanning,
  } = useCanvasStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panStartViewport, setPanStartViewport] = useState({ x: 0, y: 0 });

  // ─── Canvas Click (place node or deselect) ─────────────────────

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only handle clicks directly on the canvas, not on nodes
    if (e.target !== canvasRef.current) return;

    if (toolMode === 'select' || toolMode === 'pan') {
      setSelectedNode(null);
      return;
    }

    if (toolMode === 'connect') return;

    // Place a new node at click position
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const y = (e.clientY - rect.top - viewport.y) / viewport.zoom;

    addNode(toolMode, { x, y });
  }, [toolMode, viewport, addNode, setSelectedNode]);

  // ─── Pan ────────────────────────────────────────────────────────

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (toolMode === 'pan' || e.button === 1) { // middle mouse
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setPanStartViewport({ x: viewport.x, y: viewport.y });
    }
  }, [toolMode, viewport, setIsPanning]);

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setViewport({
        x: panStartViewport.x + dx,
        y: panStartViewport.y + dy,
      });
    };

    const handleMouseUp = () => setIsPanning(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, panStart, panStartViewport, setViewport, setIsPanning]);

  // ─── Zoom ──────────────────────────────────────────────────────

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, viewport.zoom * delta));

    // Zoom towards cursor position
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const newX = cx - (cx - viewport.x) * (newZoom / viewport.zoom);
    const newY = cy - (cy - viewport.y) * (newZoom / viewport.zoom);

    setViewport({ x: newX, y: newY, zoom: newZoom });
  }, [viewport, setViewport]);

  // ─── Keyboard shortcuts ────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if ((document.activeElement as HTMLElement)?.contentEditable === 'true') return;

      switch (e.key) {
        case 'v': setToolMode('select'); break;
        case 'h': setToolMode('pan'); break;
        case 'c': setToolMode('connect'); break;
        case 'Escape': setToolMode('select'); setSelectedNode(null); break;
        case '0':
          setViewport({ x: 0, y: 0, zoom: 1 });
          break;
        case '=':
        case '+':
          setViewport({ zoom: Math.min(3, viewport.zoom * 1.2) });
          break;
        case '-':
          setViewport({ zoom: Math.max(0.1, viewport.zoom * 0.8) });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setToolMode, setSelectedNode, setViewport, viewport.zoom]);

  // ─── Render ────────────────────────────────────────────────────

  const cursorClass =
    toolMode === 'pan' ? 'cursor-grab' :
    isPanning ? 'cursor-grabbing' :
    toolMode === 'connect' ? 'cursor-crosshair' :
    toolMode === 'select' ? 'cursor-default' :
    'cursor-cell'; // placement mode

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-950 relative">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: `${30 * viewport.zoom}px ${30 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x % (30 * viewport.zoom)}px ${viewport.y % (30 * viewport.zoom)}px`,
        }}
      />

      {/* Canvas surface */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative ${cursorClass}`}
        onClick={handleCanvasClick}
        onMouseDown={handlePanStart}
        onWheel={handleWheel}
      >
        {/* Transform container for pan/zoom */}
        <div
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Edges (SVG layer) */}
          <CanvasEdges containerRef={canvasRef} />

          {/* Nodes (HTML layer) */}
          {nodes.map(node => (
            <CanvasNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
            />
          ))}

          {/* Brain cursors */}
          {brains.filter(b => b.status !== 'offline').map(brain => (
            <BrainCursor key={brain.id} brain={brain} />
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <CanvasToolbar />

      {/* Natural language input */}
      <NaturalLanguageInput />

      {/* Top bar */}
      <TopBar />

      {/* Brain panel */}
      <BrainPanel />

      {/* Minimap */}
      <Minimap />
    </div>
  );
}

// ─── Top Bar ────────────────────────────────────────────────────

function TopBar() {
  const { viewport, setViewport } = useCanvasStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      {/* Logo */}
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl px-4 py-2 shadow-xl flex items-center gap-2">
        <span className="text-lg">✦</span>
        <span className="text-sm font-semibold text-gray-200 tracking-wider">CANVION</span>
        <span className="text-xs text-gray-500 ml-1">α</span>
      </div>

      {/* Zoom controls */}
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl px-2 py-1 shadow-xl flex items-center gap-1">
        <button
          onClick={() => setViewport({ zoom: Math.max(0.1, viewport.zoom * 0.8) })}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all"
        >
          −
        </button>
        <button
          onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
          className="px-2 h-8 flex items-center justify-center text-xs text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all"
        >
          {Math.round(viewport.zoom * 100)}%
        </button>
        <button
          onClick={() => setViewport({ zoom: Math.min(3, viewport.zoom * 1.2) })}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Brain Cursor ───────────────────────────────────────────────

function BrainCursor({ brain }: { brain: any }) {
  const statusEmoji: Record<string, string> = {
    idle: '💤',
    thinking: '💭',
    acting: '⚡',
    messaging: '💬',
  };

  return (
    <div
      className="absolute pointer-events-none transition-all duration-500 ease-out"
      style={{
        left: brain.position.x,
        top: brain.position.y,
        zIndex: 99999,
      }}
    >
      {/* Cursor */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 4L10 20L12.5 12.5L20 10L4 4Z" fill={brain.color} fillOpacity="0.8" />
      </svg>

      {/* Name tag */}
      <div
        className="absolute left-6 top-4 px-2 py-0.5 rounded-full text-xs text-white whitespace-nowrap shadow-lg"
        style={{ background: brain.color }}
      >
        {statusEmoji[brain.status] || '🧠'} {brain.name}
      </div>
    </div>
  );
}

// ─── Brain Panel ────────────────────────────────────────────────

function BrainPanel() {
  const { brains, showBrainPanel, toggleBrainPanel } = useCanvasStore();

  if (!showBrainPanel) {
    return (
      <button
        onClick={toggleBrainPanel}
        className="fixed right-4 top-4 z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-2 shadow-xl text-gray-400 hover:text-white transition-colors"
      >
        🧠
      </button>
    );
  }

  return (
    <div className="fixed right-4 top-4 z-50 w-64">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-200">🧠 Brains</h3>
          <button
            onClick={toggleBrainPanel}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-2">
          {brains.length === 0 ? (
            <div className="text-center py-6 text-gray-600 text-sm">
              <p className="mb-2">No Brains active</p>
              <p className="text-xs">Type a command below to spawn one</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {brains.map(brain => (
                <div
                  key={brain.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800/50 transition-colors"
                >
                  <div className="text-xl">{brain.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-200">{brain.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {brain.status === 'thinking' ? '💭 Thinking...' :
                       brain.status === 'acting' ? `⚡ ${brain.currentTask}` :
                       brain.status === 'messaging' ? '💬 In conversation' :
                       '💤 Idle'}
                    </div>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: brain.status === 'idle' ? '#6b7280' :
                                  brain.status === 'thinking' ? '#f59e0b' :
                                  brain.status === 'acting' ? '#10b981' :
                                  '#6366f1',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Brain button */}
        <div className="border-t border-gray-700/50 p-2">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-sm text-gray-400 hover:text-gray-200 transition-all">
            <span>+</span>
            <span>Add Brain</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Minimap ────────────────────────────────────────────────────

function Minimap() {
  const { nodes, viewport, showMinimap, edges } = useCanvasStore();

  if (!showMinimap || nodes.length === 0) return null;

  // Calculate bounds
  const bounds = nodes.reduce(
    (acc, n) => ({
      minX: Math.min(acc.minX, n.position.x),
      minY: Math.min(acc.minY, n.position.y),
      maxX: Math.max(acc.maxX, n.position.x + n.size.width),
      maxY: Math.max(acc.maxY, n.position.y + n.size.height),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );

  const padding = 50;
  const worldW = bounds.maxX - bounds.minX + padding * 2;
  const worldH = bounds.maxY - bounds.minY + padding * 2;
  const minimapW = 160;
  const minimapH = (worldH / worldW) * minimapW;
  const scale = minimapW / worldW;

  return (
    <div className="fixed bottom-6 right-4 z-40">
      <div
        className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-xl overflow-hidden"
        style={{ width: minimapW, height: Math.min(minimapH, 120) }}
      >
        <svg width={minimapW} height={Math.min(minimapH, 120)}>
          {/* Edges */}
          {edges.map(edge => {
            const src = nodes.find(n => n.id === edge.source);
            const tgt = nodes.find(n => n.id === edge.target);
            if (!src || !tgt) return null;
            return (
              <line
                key={edge.id}
                x1={(src.position.x + src.size.width / 2 - bounds.minX + padding) * scale}
                y1={(src.position.y + src.size.height / 2 - bounds.minY + padding) * scale}
                x2={(tgt.position.x + tgt.size.width / 2 - bounds.minX + padding) * scale}
                y2={(tgt.position.y + tgt.size.height / 2 - bounds.minY + padding) * scale}
                stroke="#4b5563"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(n => (
            <rect
              key={n.id}
              x={(n.position.x - bounds.minX + padding) * scale}
              y={(n.position.y - bounds.minY + padding) * scale}
              width={n.size.width * scale}
              height={n.size.height * scale}
              rx="1"
              fill="#6366f1"
              fillOpacity="0.5"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
