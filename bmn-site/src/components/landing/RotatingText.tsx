'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';

const ROLES = ['Importers', 'Exporters', 'Forwarders', 'Manufacturers', 'Suppliers', 'Brokers'];

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const hiddenTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROLES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (hiddenTextRef.current) {
      const measureSpan = document.createElement('span');
      measureSpan.style.visibility = 'hidden';
      measureSpan.style.position = 'absolute';
      measureSpan.style.whiteSpace = 'nowrap';
      measureSpan.style.font = window.getComputedStyle(hiddenTextRef.current).font;
      measureSpan.textContent = ROLES[currentIndex];
      document.body.appendChild(measureSpan);
      
      const newWidth = measureSpan.getBoundingClientRect().width;
      requestAnimationFrame(() => {
        setWidth(newWidth);
      });
      
      document.body.removeChild(measureSpan);
    }
  }, [currentIndex]);

  return (
    <span 
      className="inline-flex flex-col align-top h-[1.2em] relative transition-all duration-500 ease-in-out text-center overflow-visible font-bold" 
      style={{ width: width ? `${width}px` : 'auto' }}
    >
      {/* Hidden reference for font style matching */}
      <span ref={hiddenTextRef} className="opacity-0 absolute pointer-events-none">{ROLES[0]}</span>
      
      {ROLES.map((role, index) => (
        <span
          key={role}
          className={`absolute left-0 top-0 w-full transition-all duration-500 flex justify-center text-gradient-primary ${
            index === currentIndex
              ? 'opacity-100 translate-y-0'
              : index === (currentIndex - 1 + ROLES.length) % ROLES.length
              ? 'opacity-0 -translate-y-full'
              : 'opacity-0 translate-y-full'
          }`}
        >
          {role}
        </span>
      ))}
    </span>
  );
}
