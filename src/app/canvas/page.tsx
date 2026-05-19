'use client';

import { useEffect, useState } from 'react';
import Canvas from '@/canvas/Canvas';

export default function CanvasPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✦</div>
          <h1 className="text-xl font-semibold text-gray-200 tracking-wider mb-2">CANVION</h1>
          <p className="text-sm text-gray-500">Loading canvas...</p>
          <div className="mt-4 w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return <Canvas />;
}
