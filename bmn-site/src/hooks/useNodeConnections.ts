'use client';

import { useState, useEffect, RefObject } from 'react';

type Connection = { x1: number; y1: number; x2: number; y2: number };

export function useNodeConnections(
  sourceRef: RefObject<HTMLElement | null>,
  targetRefs: RefObject<HTMLElement | null>[]
) {
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const updateConnections = () => {
      if (!sourceRef.current) return;

      const sourceRect = sourceRef.current.getBoundingClientRect();
      // Calculate relative to the parent container usually, but here we can just use offset from the container if we pass a container ref, 
      // OR we can simple calculate relative coordinates if the SVG is absolutely positioned to cover the whole area.
      // A common concise way: assuming SVG is absolute inset-0 in a relative container.
      
      // We need the offset relative to the container. 
      // Let's assume the component using this will provide a container ref or we just use viewport constrained coords 
      // IF the SVG is fixed. But usually it's absolute in a relative parent.
      // So we need (ElementRect.left - ContainerRect.left) + (ElementRect.width / 2)
      
      const container = sourceRef.current.closest('.network-container');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();

      const getCenter = (rect: DOMRect) => ({
        x: (rect.left - containerRect.left) + (rect.width / 2),
        y: (rect.top - containerRect.top) + (rect.height / 2)
      });

      const sourceCenter = getCenter(sourceRect);

      const newConnections = targetRefs.map(targetRef => {
        if (!targetRef.current) return null;
        const targetRect = targetRef.current.getBoundingClientRect();
        const targetCenter = getCenter(targetRect);
        
        return {
          x1: sourceCenter.x,
          y1: sourceCenter.y,
          x2: targetCenter.x,
          y2: targetCenter.y
        };
      }).filter((c): c is Connection => c !== null);

      setConnections(newConnections);
    };

    // Initial calculation
    // Small timeout to ensure layout is settled
    const timeoutId = setTimeout(updateConnections, 100);

    // Resize Observer for robust updates
    const observer = new ResizeObserver(updateConnections);
    if (sourceRef.current) observer.observe(sourceRef.current);
    targetRefs.forEach(ref => ref.current && observer.observe(ref.current));
    
    // Also listen to window resize as a fallback
    window.addEventListener('resize', updateConnections);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', updateConnections);
    };
  }, [sourceRef, targetRefs]);

  return connections;
}
