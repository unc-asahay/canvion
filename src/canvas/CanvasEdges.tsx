'use client';

import React, { useMemo } from 'react';
import { useCanvasStore, CanvasEdge as EdgeType } from '@/state/canvas-store';

interface CanvasEdgesProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function CanvasEdges({ containerRef }: CanvasEdgesProps) {
  const { edges, nodes, selectedEdgeId, setSelectedEdge, deleteEdge, viewport } = useCanvasStore();

  // Calculate edge paths
  const edgePaths = useMemo(() => {
    return edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return null;

      // Calculate center points of source and target
      const sx = sourceNode.position.x + sourceNode.size.width / 2;
      const sy = sourceNode.position.y + sourceNode.size.height / 2;
      const tx = targetNode.position.x + targetNode.size.width / 2;
      const ty = targetNode.position.y + targetNode.size.height / 2;

      // Calculate edge points on node boundaries
      const sourcePoint = getEdgePoint(sourceNode.position, sourceNode.size, tx, ty);
      const targetPoint = getEdgePoint(targetNode.position, targetNode.size, sx, sy);

      // Cubic bezier control points
      const dx = targetPoint.x - sourcePoint.x;
      const dy = targetPoint.y - sourcePoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const curvature = Math.min(dist * 0.3, 100);

      const cx1 = sourcePoint.x + (dx > 0 ? curvature : -curvature);
      const cy1 = sourcePoint.y;
      const cx2 = targetPoint.x - (dx > 0 ? curvature : -curvature);
      const cy2 = targetPoint.y;

      const path = `M ${sourcePoint.x} ${sourcePoint.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetPoint.x} ${targetPoint.y}`;

      // Label position (midpoint)
      const lx = (sourcePoint.x + targetPoint.x) / 2;
      const ly = (sourcePoint.y + targetPoint.y) / 2 - 12;

      return { ...edge, path, sourcePoint, targetPoint, labelPos: { x: lx, y: ly } };
    }).filter(Boolean);
  }, [edges, nodes]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
        <marker
          id="arrowhead-selected"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
        </marker>
      </defs>

      {edgePaths.map(edge => {
        if (!edge) return null;
        const isSelected = edge.id === selectedEdgeId;

        return (
          <g key={edge.id}>
            {/* Invisible wide path for easier clicking */}
            <path
              d={edge.path}
              fill="none"
              stroke="transparent"
              strokeWidth="20"
              className="pointer-events-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEdge(edge.id);
              }}
            />

            {/* Visible path */}
            <path
              d={edge.path}
              fill="none"
              stroke={isSelected ? '#60a5fa' : '#4b5563'}
              strokeWidth={isSelected ? 2.5 : 1.5}
              strokeDasharray={edge.animated ? '8 4' : 'none'}
              markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
              className="pointer-events-none"
              style={{
                filter: isSelected ? 'drop-shadow(0 0 4px rgba(96,165,250,0.5))' : 'none',
              }}
            />

            {/* Animated dash */}
            {edge.animated && (
              <path
                d={edge.path}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="8 12"
                className="pointer-events-none"
                style={{
                  animation: 'dash 1s linear infinite',
                }}
              />
            )}

            {/* Label */}
            {edge.label && (
              <>
                <rect
                  x={edge.labelPos.x - edge.label.length * 3.5 - 6}
                  y={edge.labelPos.y - 10}
                  width={edge.label.length * 7 + 12}
                  height={20}
                  rx="4"
                  fill="#1f2937"
                  stroke={isSelected ? '#60a5fa' : '#374151'}
                  strokeWidth="1"
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdge(edge.id);
                  }}
                />
                <text
                  x={edge.labelPos.x}
                  y={edge.labelPos.y + 4}
                  textAnchor="middle"
                  fill={isSelected ? '#93c5fd' : '#9ca3af'}
                  fontSize="11"
                  fontFamily="system-ui"
                  className="pointer-events-none select-none"
                >
                  {edge.label}
                </text>
              </>
            )}

            {/* Delete button when selected */}
            {isSelected && (
              <g
                className="pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEdge(edge.id);
                }}
              >
                <circle cx={edge.labelPos.x + edge.label!.length * 3.5 + 16} cy={edge.labelPos.y} r="8" fill="#ef4444" />
                <text
                  x={edge.labelPos.x + edge.label!.length * 3.5 + 16}
                  y={edge.labelPos.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ×
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* dash animation defined in globals.css */}
    </svg>
  );
}

// Helper: calculate point on node boundary facing target
function getEdgePoint(
  nodePos: { x: number; y: number },
  nodeSize: { width: number; height: number },
  targetX: number,
  targetY: number,
): { x: number; y: number } {
  const cx = nodePos.x + nodeSize.width / 2;
  const cy = nodePos.y + nodeSize.height / 2;
  const dx = targetX - cx;
  const dy = targetY - cy;

  if (dx === 0 && dy === 0) return { x: cx, y: cy };

  const hw = nodeSize.width / 2;
  const hh = nodeSize.height / 2;

  // Determine which edge the line crosses
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let x: number, y: number;
  if (absDx * hh > absDy * hw) {
    // Crosses left or right edge
    const sign = dx > 0 ? 1 : -1;
    x = cx + sign * hw;
    y = cy + (dy * hw) / absDx;
  } else {
    // Crosses top or bottom edge
    const sign = dy > 0 ? 1 : -1;
    x = cx + (dx * hh) / absDy;
    y = cy + sign * hh;
  }

  return { x, y };
}
