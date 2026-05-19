'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCanvasStore } from '@/state/canvas-store';

export default function NaturalLanguageInput() {
  const { naturalLanguageInput, setNaturalLanguageInput, addNode, addEvent, viewport } = useCanvasStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isExpanded && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        setNaturalLanguageInput('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, setNaturalLanguageInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalLanguageInput.trim()) return;

    const prompt = naturalLanguageInput.trim();
    setHistory(prev => [...prev, prompt]);
    setHistoryIndex(-1);
    setIsProcessing(true);

    // Log the event
    addEvent('human', 'natural_language', prompt);

    // For now, create a card with the prompt
    // Later this will route to a Brain
    const centerX = (-viewport.x + 400) / viewport.zoom;
    const centerY = (-viewport.y + 300) / viewport.zoom;

    addNode('card', { x: centerX, y: centerY }, 'human',
      `<h3>💭 ${prompt}</h3><p style="opacity:0.6;font-size:12px;">Waiting for Brain to process...</p>`
    );

    setNaturalLanguageInput('');
    setIsProcessing(false);
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setNaturalLanguageInput(history[newIndex]);
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setNaturalLanguageInput('');
        } else {
          setHistoryIndex(newIndex);
          setNaturalLanguageInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      {/* Expanded input */}
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg">🧠</span>
              <input
                ref={inputRef}
                type="text"
                value={naturalLanguageInput}
                onChange={(e) => setNaturalLanguageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell the Brains what to build..."
                className="flex-1 bg-transparent text-gray-100 text-sm outline-none placeholder-gray-500"
                disabled={isProcessing}
              />
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <button
                  type="submit"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 10L17 10M17 10L12 5M17 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Quick actions */}
            <div className="border-t border-gray-700/50 px-4 py-2 flex gap-2 flex-wrap">
              <QuickAction icon="🏗️" label="Architecture" onClick={() => setNaturalLanguageInput('Design a microservices architecture for ')} />
              <QuickAction icon="📊" label="Data model" onClick={() => setNaturalLanguageInput('Create a data model for ')} />
              <QuickAction icon="🔄" label="Flowchart" onClick={() => setNaturalLanguageInput('Build a flowchart for ')} />
              <QuickAction icon="⚡" label="API design" onClick={() => setNaturalLanguageInput('Design REST API endpoints for ')} />
              <QuickAction icon="🛡️" label="Security" onClick={() => setNaturalLanguageInput('Analyze security considerations for ')} />
            </div>
          </div>

          {/* Hint */}
          <div className="text-center mt-2 text-xs text-gray-600">
            Press Enter to send · ↑↓ history · Esc to close
          </div>
        </form>
      ) : (
        /* Collapsed trigger */
        <button
          onClick={() => {
            setIsExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="w-full bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl px-5 py-3 flex items-center gap-3 hover:border-gray-600/50 transition-all shadow-xl group"
        >
          <span className="text-lg">🧠</span>
          <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
            Tell the Brains what to build...
          </span>
          <span className="ml-auto text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-md">
            /
          </span>
        </button>
      )}
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-xs text-gray-400 hover:text-gray-200 transition-all"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
