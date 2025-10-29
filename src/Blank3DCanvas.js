import React, { useRef, useEffect } from 'react';

export default function Blank3DCanvas({ width = 420, height = 340 }) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    // Blank canvas, ready for 3D drawing
  }, [width, height]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ width: '100%', maxWidth: width, display: 'block', margin: '0 auto', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      aria-label="Blank 3D Canvas"
    />
  );
}
