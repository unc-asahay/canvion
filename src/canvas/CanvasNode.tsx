'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useCanvasStore, CanvasNode as CanvasNodeType } from '@/state/canvas-store';
import { getNodeType } from '@/nodes/registry';

interface CanvasNodeProps {
  node: CanvasNodeType;
  isSelected: boolean;
}

export default function CanvasNode({ node, isSelected }: CanvasNodeProps) {
  const {
    setSelectedNode, updateNode, deleteNode, moveNode, resizeNode,
    bringToFront, toolMode, addEdge, selectedNodeId
  } = useCanvasStore();

  const nodeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const typeDef = getNodeType(node.type);

  // ─── Drag ──────────────────────────────────────────────────────

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) return;
    if (toolMode === 'connect') {
      // In connect mode, clicking a node starts/ends a connection
      if (selectedNodeId && selectedNodeId !== node.id) {
        addEdge(selectedNodeId, node.id);
        return;
      }
    }

    e.stopPropagation();
    setSelectedNode(node.id);
    bringToFront(node.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX - node.position.x, y: e.clientY - node.position.y });
  }, [isEditing, toolMode, selectedNodeId, node.id, node.position, setSelectedNode, bringToFront, addEdge]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - dragStart.x;
      const y = e.clientY - dragStart.y;
      moveNode(node.id, { x, y });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, node.id, moveNode]);

  // ─── Resize ────────────────────────────────────────────────────

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: node.size.width,
      h: node.size.height,
    });
  }, [node.size]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeStart.x;
      const dy = e.clientY - resizeStart.y;
      resizeNode(node.id, {
        width: Math.max(120, resizeStart.w + dx),
        height: Math.max(60, resizeStart.h + dy),
      });
    };

    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, node.id, resizeNode]);

  // ─── Content Edit ──────────────────────────────────────────────

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.locked) return;
    setIsEditing(true);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  }, [node.locked]);

  const handleContentBlur = useCallback(() => {
    setIsEditing(false);
    if (contentRef.current) {
      updateNode(node.id, { content: contentRef.current.innerHTML });
    }
  }, [node.id, updateNode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      contentRef.current?.blur();
    }
    e.stopPropagation();
  }, []);

  // ─── Delete ────────────────────────────────────────────────────

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isSelected && (e.key === 'Delete' || e.key === 'Backspace') && !isEditing) {
        deleteNode(node.id);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSelected, isEditing, node.id, deleteNode]);

  // ─── Render ────────────────────────────────────────────────────

  const isConnectSource = toolMode === 'connect' && selectedNodeId === node.id;

  return (
    <div
      ref={nodeRef}
      className="cvn-node"
      data-node-id={node.id}
      data-node-type={node.type}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        width: node.size.width,
        height: node.size.height,
        zIndex: node.zIndex,
        cursor: isDragging ? 'grabbing' : toolMode === 'connect' ? 'crosshair' : 'grab',
        userSelect: isEditing ? 'text' : 'none',
        ...node.style,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Selection ring */}
      {isSelected && (
        <div className="absolute inset-[-3px] rounded-[14px] border-2 border-blue-500 pointer-events-none animate-pulse" />
      )}

      {/* Connect mode indicator */}
      {isConnectSource && (
        <div className="absolute inset-[-3px] rounded-[14px] border-2 border-green-500 pointer-events-none" />
      )}

      {/* Type badge */}
      <div className="absolute -top-3 -left-1 text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {typeDef.icon} {typeDef.label}
      </div>

      {/* Created by indicator */}
      {node.createdBy !== 'human' && (
        <div
          className="absolute -top-3 -right-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(139,92,246,0.3)', color: '#c4b5fd' }}
        >
          🧠 AI
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="cvn-node-content w-full h-full overflow-auto outline-none"
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleContentBlur}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: node.content }}
        style={{
          pointerEvents: isEditing ? 'auto' : 'none',
          caretColor: isEditing ? '#60a5fa' : 'transparent',
        }}
      />

      {/* Resize handle */}
      {isSelected && !node.locked && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M14 14L14 8M14 14L8 14M10 14L14 10M14 14L12 14" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Delete button */}
      {isSelected && (
        <button
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
        >
          ×
        </button>
      )}

      <style jsx>{`
        .cvn-node {
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2);
          transition: box-shadow 0.2s;
          group: true;
        }
        .cvn-node:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3);
        }
        .cvn-node-content table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .cvn-node-content th,
        .cvn-node-content td {
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 10px;
          text-align: left;
        }
        .cvn-node-content th {
          background: rgba(255,255,255,0.05);
          font-weight: 600;
        }
        .cvn-node-content pre {
          background: rgba(0,0,0,0.3);
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
          overflow-x: auto;
        }
        .cvn-node-content h3,
        .cvn-node-content h4 {
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        .cvn-node-content p {
          margin: 0 0 6px 0;
          font-size: 14px;
          line-height: 1.5;
        }
        .cvn-node-content ul {
          margin: 0;
          padding-left: 20px;
        }
        .cvn-node-content li {
          margin-bottom: 4px;
          font-size: 14px;
        }
        .cvn-node-content input,
        .cvn-node-content textarea {
          width: 100%;
          padding: 8px;
          margin: 4px 0;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px;
          color: inherit;
          font-size: 13px;
        }
        .cvn-node-content button.cvn-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        .cvn-node-content .cvn-btn-primary {
          background: #6366f1;
          color: white;
        }
        .cvn-node-content .brain-card {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cvn-node-content .brain-avatar {
          font-size: 28px;
        }
        .cvn-node-content .brain-status {
          font-size: 12px;
          opacity: 0.7;
          margin: 4px 0 0 0;
        }
        .cvn-node-content .chart-placeholder,
        .cvn-node-content .image-placeholder,
        .cvn-node-content .iframe-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-size: 14px;
          opacity: 0.6;
        }
        .cvn-node-content form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cvn-node-content form label {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
