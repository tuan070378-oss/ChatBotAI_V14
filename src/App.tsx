/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import ChatInterface from './components/ChatInterface';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect mobile / touch devices to disable custom cursor
    const checkTouch = () => {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        setIsTouchDevice(true);
      }
    };
    checkTouch();

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target && 
        (target.tagName === 'BUTTON' || 
         target.tagName === 'A' || 
         target.tagName === 'INPUT' || 
         target.tagName === 'TEXTAREA' || 
         target.tagName === 'SELECT' || 
         target.closest('button') || 
         target.closest('a') ||
         target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <ErrorBoundary>
      {/* Hide native cursor in dark mode for premium look, using our custom one on desktop */}
      <main className="min-h-screen font-sans antialiased select-none-text selection:bg-cyan-500/30 selection:text-cyan-200">
        {!isTouchDevice && (
          <div 
            className={`cosmic-cursor hidden sm:block ${isHovered ? 'cosmic-cursor-hover' : ''}`}
            style={{ 
              left: `${coords.x}px`, 
              top: `${coords.y}px` 
            }}
          />
        )}
        <ChatInterface />
      </main>
    </ErrorBoundary>
  );
}

