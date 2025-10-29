import React, { useRef, useEffect } from 'react';

// Smooth, detailed response curves for S, M, L cones and rods (Gaussian-like, normalized)
const curveDefs = [
  {
    label: 'ROD', color: '#000', peak: 498, width: 40, height: 0.9
  },
  {
    label: 'S CONE', color: '#0050ff', peak: 420, width: 35, height: 1.0
  },
  {
    label: 'M CONE', color: '#00ff40', peak: 534, width: 45, height: 1.0
  },
  {
    label: 'L CONE', color: '#ff2020', peak: 564, width: 50, height: 1.0
  }
];

function responseAt(wl, { peak, width, height }) {
  // Gaussian-like curve, clipped to [0,1]
  const resp = height * Math.exp(-0.5 * Math.pow((wl - peak) / width, 2));
  return resp > 0.01 ? resp : 0;
}

export default function ConeRodResponseCanvas({ width = 700, height = 260 }) {
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

  // Draw colored spectrum background
  const grad = ctx.createLinearGradient(60, height / 2, width - 30, height / 2);
  grad.addColorStop(0.00, '#e6e6fa'); // UV
  grad.addColorStop(0.08, '#b6a1ff'); // violet
  grad.addColorStop(0.18, '#3a6cff'); // blue
  grad.addColorStop(0.32, '#00ffea'); // cyan
  grad.addColorStop(0.48, '#baffb6'); // green
  grad.addColorStop(0.62, '#fff9b6'); // yellow
  grad.addColorStop(0.75, '#ffd6b6'); // orange
  grad.addColorStop(0.90, '#ffb6b6'); // red
  grad.addColorStop(1.00, '#fbe6e6'); // IR
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(60, 30, width - 90, height - 70);
  ctx.restore();

  // Axes
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(60, height - 40);
  ctx.lineTo(width - 30, height - 40); // x-axis
  ctx.moveTo(60, height - 40);
  ctx.lineTo(60, 30); // y-axis
  ctx.stroke();

    // X-axis labels (wavelength)
    ctx.font = '13px monospace';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    [400, 500, 600, 700].forEach(wl => {
      const x = 60 + ((wl - 380) / (700 - 380)) * (width - 90);
      ctx.fillText(wl + ' nm', x, height - 28);
    });
    // Left axis label vertical
    ctx.save();
    ctx.translate(32, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('RELATIVE RESPONSE', 0, 0);
    ctx.restore();

    // Plot smooth, thin, continuous curves
    curveDefs.forEach((curve, idx) => {
      ctx.beginPath();
      for (let wl = 380; wl <= 700; wl += 0.5) {
        const resp = responseAt(wl, curve);
        const x = 60 + ((wl - 380) / (700 - 380)) * (width - 90);
        const y = height - 40 - resp * (height - 80);
        if (wl === 380) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = curve.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]); // continuous
      ctx.shadowBlur = 0;
      ctx.stroke();
    });

    // Legend
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let legendX = width / 2 - 180;
    let legendY = 18;
    curveDefs.forEach((curve, i) => {
      ctx.beginPath();
      ctx.moveTo(legendX + i * 120, legendY);
      ctx.lineTo(legendX + i * 120 + 40, legendY);
      ctx.strokeStyle = curve.color;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.font = '14px monospace';
      ctx.fillStyle = curve.color;
      ctx.textAlign = 'left';
      ctx.fillText(curve.label, legendX + i * 120 + 50, legendY - 2);
    });
  }, [width, height]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ width: '100%', maxWidth: width, display: 'block', margin: '2.2rem auto 0.8rem auto', borderRadius: '8px', background: '#fff', boxShadow: '0 6px 32px rgba(0,0,0,0.12), 0 1.5px 8px rgba(0,0,0,0.08)' }}
      aria-label="Relative response of cones and rods vs wavelength"
    />
  );
}
