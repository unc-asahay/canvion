'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✦</span>
            <span className="text-lg font-semibold tracking-widest text-gray-200">CANVION</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Features</a>
            <a href="#how" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">How it works</a>
            <Link
              href="/canvas"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
            >
              Open Canvas →
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <main className="max-w-5xl mx-auto px-8 pt-24 pb-32">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-800/50 border border-gray-700/50 text-xs text-gray-400 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Numerologically aligned · Master Teacher (33)
              </div>

              <h1 className="text-6xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
                  The Canvas Where
                </span>
                <br />
                <span className="text-gray-100">Minds Collaborate</span>
              </h1>

              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                AI Brains and humans working together on an infinite HTML canvas.
                Not generating diagrams — <span className="text-gray-200">building them together</span>,
                in real time, with full visibility and control.
              </p>

              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/canvas"
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  Open Canvas ✦
                </Link>
                <a
                  href="https://github.com/unc-asahay/canvion"
                  target="_blank"
                  className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition-all text-sm font-medium border border-gray-700/50"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>

          {/* Canvas preview */}
          <div className={`mt-20 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl">
              {/* Mock canvas */}
              <div className="h-96 relative p-8">
                {/* Mock nodes */}
                <div className="absolute top-8 left-8 w-48 bg-yellow-900/30 border border-yellow-700/30 rounded-xl p-4 text-sm">
                  <div className="text-yellow-400 font-medium mb-1">📝 Sticky Note</div>
                  <div className="text-gray-400 text-xs">User research findings...</div>
                </div>
                <div className="absolute top-8 right-8 w-52 bg-gray-800/80 border border-gray-700/50 rounded-xl p-4 text-sm">
                  <div className="text-blue-400 font-medium mb-1">🃏 Architecture Card</div>
                  <div className="text-gray-400 text-xs">API Gateway → Services → DB</div>
                </div>
                <div className="absolute bottom-8 left-1/3 w-56 bg-indigo-900/30 border border-indigo-700/30 rounded-xl p-4 text-sm">
                  <div className="text-indigo-400 font-medium mb-1">📊 Data Model</div>
                  <div className="text-gray-400 text-xs">Users, Posts, Comments tables</div>
                </div>

                {/* Mock brain cursor */}
                <div className="absolute top-20 left-1/2 transition-all duration-1000">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-bounce">
                    <path d="M4 4L10 20L12.5 12.5L20 10L4 4Z" fill="#8b5cf6" fillOpacity="0.8" />
                  </svg>
                  <div className="absolute left-5 top-4 bg-purple-600 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                    💭 Architect thinking...
                  </div>
                </div>

                {/* Mock edge */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <path d="M 160 80 C 250 80, 300 80, 380 80" stroke="#4b5563" strokeWidth="1.5" fill="none" markerEnd="url(#mock-arrow)" />
                  <path d="M 380 120 C 380 180, 300 250, 280 280" stroke="#4b5563" strokeWidth="1.5" fill="none" markerEnd="url(#mock-arrow)" />
                  <defs>
                    <marker id="mock-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#4b5563" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Mock toolbar */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/90 border border-gray-700/50 rounded-xl p-2 flex flex-col gap-1">
                {['👆', '✋', '📝', '🃏', '📊', '💻', '🔗'].map((icon, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${i === 0 ? 'bg-blue-500/20' : ''}`}>
                    {icon}
                  </div>
                ))}
              </div>

              {/* Mock NL input */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 bg-gray-900/90 border border-gray-700/50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span>🧠</span>
                <span className="text-sm text-gray-500">Tell the Brains what to build...</span>
                <span className="ml-auto text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">/</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div id="features" className="mt-32 grid grid-cols-3 gap-6">
            {[
              {
                icon: '🧠',
                title: 'Multiple AI Brains',
                desc: 'Specialist agents with distinct personas — Architect, Data, Reviewer — each with persistent memory and tools.',
              },
              {
                icon: '👁️',
                title: 'Visible Work',
                desc: 'Watch Brains think and build in real-time. Cursors move, status pills pulse, decisions happen in front of you.',
              },
              {
                icon: '🤝',
                title: 'True Collaboration',
                desc: 'Human and AI share the same canvas with the same tools. Drag, edit, override — you are a peer, not a controller.',
              },
              {
                icon: '🏗️',
                title: 'HTML-Native Canvas',
                desc: 'Every node is real HTML — tables, forms, charts, code blocks. Not pixels. Not SVG. Full web components.',
              },
              {
                icon: '⚡',
                title: 'Tool Spawning',
                desc: 'Brains can fetch URLs, generate images, render charts, search icons — and place results directly on canvas.',
              },
              {
                icon: '💾',
                title: 'Git-Versioned',
                desc: 'Every save is a commit. Full version history. Branch diagrams. Collaborate via PRs.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`bg-gray-900/30 border border-gray-800/50 rounded-2xl p-6 transition-all duration-500 delay-${i * 100} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-sm font-semibold text-gray-200 mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div id="how" className="mt-32 text-center">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">How it works</h2>
            <p className="text-gray-500 mb-12 max-w-lg mx-auto">
              Three layers working together — the canvas, the tools, and the brains.
            </p>

            <div className="flex items-center justify-center gap-8">
              {[
                { step: '1', title: 'You speak', desc: 'Tell the Brains what you need in natural language', icon: '💬' },
                { step: '→', title: '', desc: '', icon: '' },
                { step: '2', title: 'Brains act', desc: 'AI agents create, connect, and build on the canvas', icon: '🧠' },
                { step: '→', title: '', desc: '', icon: '' },
                { step: '3', title: 'You refine', desc: 'Drag, edit, override — the canvas is yours too', icon: '✋' },
              ].map((item, i) => (
                item.step === '→' ? (
                  <div key={i} className="text-2xl text-gray-700">→</div>
                ) : (
                  <div key={i} className="text-center w-48">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="text-xs text-gray-600 mb-1">Step {item.step}</div>
                    <div className="text-sm font-medium text-gray-200 mb-1">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-32 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-800/50 border border-gray-700/50 text-xs text-gray-400 mb-6">
              <span className="text-purple-400">✦</span>
              Built in the open · Apache 2.0
            </div>
            <h2 className="text-3xl font-bold text-gray-200 mb-4">
              The canvas is the war room.
            </h2>
            <Link
              href="/canvas"
              className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 mt-4"
            >
              Open Canvas ✦
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-8 px-8 text-center">
          <p className="text-xs text-gray-600">
            CANVION · Numerologically aligned (33) · Built with Next.js + Zustand + HTML Canvas
          </p>
        </footer>
      </div>
    </div>
  );
}
