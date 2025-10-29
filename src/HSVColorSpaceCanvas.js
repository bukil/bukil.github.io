import React, { useRef, useEffect } from 'react';

// HSV Cylinder Canvas Visualization (2D projection)
export default function HSVColorSpaceCanvas({ width = 420, height = 340 }) {
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

    // Draw HSV cylinder (side view, 2D projection)
    const cx = width / 2;
    const cy = height / 2 + 18;
    const radius = Math.min(width, height) / 2.5;
    const hSteps = 120;
    const vSteps = 80;
    // Draw cylinder surface
    for (let h = 0; h < hSteps; h++) {
      const angle = (h / hSteps) * 2 * Math.PI;
      for (let v = 0; v < vSteps; v++) {
        const sat = v / vSteps;
        const x = cx + Math.cos(angle) * radius * sat;
        const y = cy - Math.sin(angle) * radius * sat;
        const value = 1 - v / vSteps;
        ctx.beginPath();
        ctx.arc(x, y - value * radius, 2.1, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${(h / hSteps) * 360}, ${Math.round(sat * 100)}%, ${Math.round(value * 60 + 20)}%)`;
        ctx.globalAlpha = 0.95;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    // Draw cylinder outline
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy - radius, radius, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx - radius, cy - radius);
    ctx.moveTo(cx + radius, cy);
    ctx.lineTo(cx + radius, cy - radius);
    ctx.stroke();
    // Labels
    ctx.font = '15px monospace';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText('HSV Color Space (Cylinder)', cx, cy + radius + 32);
    ctx.textAlign = 'left';
    ctx.fillText('Hue', cx - radius - 18, cy - radius / 2);
    ctx.textAlign = 'right';
    ctx.fillText('Saturation', cx + radius + 18, cy - radius / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Value', cx, cy - radius - 24);
  }, [width, height]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ width: '100%', maxWidth: width, display: 'block', margin: '0 auto', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      aria-label="HSV Color Space Cylinder Visualization"
    />
  );
}
