'use client';

import React, { useState } from 'react';
import { useCanvasStore, ToolMode } from '@/state/canvas-store';
import { NODE_TYPES, NODE_CATEGORIES, NodeCategory } from '@/nodes/registry';

interface ToolDef {
  mode: ToolMode;
  icon: string;
  label: string;
  shortcut?: string;
  category?: NodeCategory;
}

export default function CanvasToolbar() {
  const { toolMode, setToolMode, nodes, edges, brains } = useCanvasStore();
  const [expandedCategory, setExpandedCategory] = useState<NodeCategory | null>(null);
  const [showStats, setShowStats] = useState(false);

  const toolGroups: { label: string; tools: ToolDef[] }[] = [
    {
      label: 'Navigate',
      tools: [
        { mode: 'select', icon: '👆', label: 'Select', shortcut: 'V' },
        { mode: 'pan', icon: '✋', label: 'Pan', shortcut: 'H' },
      ],
    },
    {
      label: 'Create',
      tools: Object.entries(NODE_TYPES).map(([key, def]) => ({
        mode: key as ToolMode,
        icon: def.icon,
        label: def.label,
        category: def.category,
      })),
    },
    {
      label: 'Connect',
      tools: [
        { mode: 'connect', icon: '🔗', label: 'Connect', shortcut: 'C' },
      ],
    },
  ];

  const handleToolClick = (mode: ToolMode) => {
    setToolMode(mode);
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      {/* Main toolbar */}
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2 shadow-2xl flex flex-col gap-1">
        {/* Navigation tools */}
        {toolGroups[0].tools.map(tool => (
          <ToolButton
            key={tool.mode}
            icon={tool.icon}
            label={tool.label}
            shortcut={tool.shortcut}
            isActive={toolMode === tool.mode}
            onClick={() => handleToolClick(tool.mode)}
          />
        ))}

        <div className="h-px bg-gray-700/50 my-1" />

        {/* Content creation tools by category */}
        {(Object.keys(NODE_CATEGORIES) as NodeCategory[]).map(cat => (
          <div key={cat} className="relative">
            <button
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all
                ${expandedCategory === cat ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-gray-700/50 text-gray-400'}`}
              onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
              title={NODE_CATEGORIES[cat].label}
            >
              {NODE_CATEGORIES[cat].icon}
            </button>

            {/* Expanded category panel */}
            {expandedCategory === cat && (
              <div className="absolute left-12 top-0 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-2 shadow-2xl min-w-[180px]">
                <div className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">
                  {NODE_CATEGORIES[cat].label}
                </div>
                {toolGroups[1].tools
                  .filter(t => t.category === cat)
                  .map(tool => (
                    <button
                      key={tool.mode}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                        ${toolMode === tool.mode ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-gray-700/50 text-gray-300'}`}
                      onClick={() => handleToolClick(tool.mode)}
                    >
                      <span className="text-base">{tool.icon}</span>
                      <span>{tool.label}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}

        <div className="h-px bg-gray-700/50 my-1" />

        {/* Connect tool */}
        {toolGroups[2].tools.map(tool => (
          <ToolButton
            key={tool.mode}
            icon={tool.icon}
            label={tool.label}
            shortcut={tool.shortcut}
            isActive={toolMode === tool.mode}
            onClick={() => handleToolClick(tool.mode)}
          />
        ))}
      </div>

      {/* Stats toggle */}
      <button
        className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-2 text-gray-400 hover:text-gray-200 transition-colors text-sm"
        onClick={() => setShowStats(!showStats)}
      >
        📊
      </button>

      {/* Stats panel */}
      {showStats && (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-3 shadow-2xl text-xs text-gray-400">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {nodes.length} nodes
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {edges.length} connections
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            {brains.length} brains
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {toolMode !== 'select' && (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl px-3 py-2 text-xs text-gray-500 text-center">
          {toolMode === 'pan' ? 'Drag to pan' :
           toolMode === 'connect' ? 'Click source → target' :
           'Click canvas to place'}
          <br />
          <span className="text-gray-600">ESC to cancel</span>
        </div>
      )}
    </div>
  );
}

// ─── Tool Button Component ─────────────────────────────────────

function ToolButton({
  icon, label, shortcut, isActive, onClick,
}: {
  icon: string;
  label: string;
  shortcut?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all group
        ${isActive ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'hover:bg-gray-700/50 text-gray-400'}`}
      onClick={onClick}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
    >
      {icon}

      {/* Tooltip */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
        {label}
        {shortcut && <span className="ml-2 text-gray-500">{shortcut}</span>}
      </div>
    </button>
  );
}
