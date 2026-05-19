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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) return;
    if (toolMode === 'connect') {
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
      moveNode(node.id, { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, node.id, moveNode]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, w: node.size.width, h: node.size.height });
  }, [node.size]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      resizeNode(node.id, {
        width: Math.max(120, resizeStart.w + e.clientX - resizeStart.x),
        height: Math.max(60, resizeStart.h + e.clientY - resizeStart.y),
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

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.locked) return;
    setIsEditing(true);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
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

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isSelected && (e.key === 'Delete' || e.key === 'Backspace') && !isEditing) {
        deleteNode(node.id);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSelected, isEditing, node.id, deleteNode]);

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
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)',
        ...node.style,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {isSelected && (
        <div className="absolute inset-[-3px] rounded-[14px] border-2 border-blue-500 pointer-events-none" style={{ animation: 'pulse 2s infinite' }} />
      )}

      {isConnectSource && (
        <div className="absolute inset-[-3px] rounded-[14px] border-2 border-green-500 pointer-events-none" />
      )}

      {node.createdBy !== 'human' && (
        <div className="absolute -top-3 -right-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
          🧠 AI
        </div>
      )}

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

      {isSelected && !node.locked && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={handleResizeStart}>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M14 14L14 8M14 14L8 14M10 14L14 10M14 14L12 14" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {isSelected && (
        <button
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
        >
          ×
        </button>
      )}
    </div>
  );
}
