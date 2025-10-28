import React, { useRef, useEffect } from 'react';

// Helper: get color for wavelength (approximate, 380-700nm)
function wavelengthToColor(wl) {
  // Map 380-700nm to HSL hue (red=0, violet=270)
  const hue = ((wl - 380) / (700 - 380)) * 270;
  return `hsl(${hue}, 100%, 50%)`;
}

export default function VisibleSpectrumCanvas({ width = 700, height = 320 }) {
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

  // Top bar: animated sine wave
  const waveHeight = 36;
  const waveY = Math.floor(height / 2) - Math.floor(waveHeight / 2); // center wave vertically
  const labelY = waveY + waveHeight + 44;
  const wavelength = 100; // mostly constant
  const t0 = performance.now();

    function drawWave(t) {
      ctx.clearRect(0, 0, width, height);
      const phase = t * 0.001;
      // Define visible spectrum region
      const visStart = Math.floor(width * 0.18); // left 18% = UV
      const visEnd = Math.floor(width * 0.82);   // right 18% = IR

      // Draw sine wave with varying wavelength
      const minWavelength = 40; // short
      const maxWavelength = 160; // long
      for (let x = 0; x < width; x++) {
        // Wavelength varies left (short) to right (long)
        const localWavelength = minWavelength + (maxWavelength - minWavelength) * (x / width);
        const y = waveY + Math.sin((x / localWavelength) * 2 * Math.PI + phase) * waveHeight;
        if (x < visStart) {
          // Ultraviolet: dotted gray
          if (x % 6 < 3) {
            ctx.fillStyle = '#bbb';
            ctx.fillRect(x, y, 1, 2);
          }
        } else if (x > visEnd) {
          // Infrared: dotted gray
          if (x % 6 < 3) {
            ctx.fillStyle = '#bbb';
            ctx.fillRect(x, y, 1, 2);
          }
        } else {
          // Visible: colored (left=violet, right=red)
          const wl = 700 - ((x - visStart) / (visEnd - visStart)) * (700 - 380);
          ctx.fillStyle = wavelengthToColor(wl);
          ctx.fillRect(x, y, 1, 2);
        }
      }
      // Draw top bar border
      ctx.strokeStyle = '#bbb';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, waveY + waveHeight + 8);
      ctx.lineTo(width, waveY + waveHeight + 8);
      ctx.stroke();

      // Draw bottom bar: visible spectrum with dark-to-violet (left) and dark-to-red (right) gradient for invisible regions (final correction)
      // Draw bottom bar: visible spectrum with improved UV gradient
      for (let x = 0; x < width; x++) {
        if (x < visStart) {
          // UV: smooth fade from dark violet to violet (use cosine for smoothness)
          const fade = 0.5 - 0.5 * Math.cos(Math.PI * (x / visStart)); // 0 to 1, smooth
          const r = Math.round(30 * (1 - fade) + 88 * fade);
          const g = 0;
          const b = Math.round(60 * (1 - fade) + 255 * fade);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        } else if (x > visEnd) {
          // IR: fade from red (left of IR) to dark red (rightmost)
          const fade = 1 - ((x - visEnd) / (width - visEnd)); // 1 (red) to 0 (dark)
          const r = Math.round(255 * fade + 60 * (1 - fade));
          const g = 0;
          const b = 0;
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        } else {
          // Visible: colored (left=violet, right=red)
          const wl = 700 - ((x - visStart) / (visEnd - visStart)) * (700 - 380);
          ctx.fillStyle = wavelengthToColor(wl);
        }
        ctx.fillRect(x, waveY + waveHeight + 16, 1, 28);
      }

      // Draw thin vertical lines at the ends of the visible spectrum and wave
      ctx.save();
      ctx.strokeStyle = 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 2;
      // Visible spectrum bar ticks
      [visStart, visEnd].forEach(tx => {
        ctx.beginPath();
        ctx.moveTo(tx, waveY + waveHeight + 16);
        ctx.lineTo(tx, waveY + waveHeight + 44);
        ctx.stroke();
      });
      // Sine wave ticks
      [visStart, visEnd].forEach(tx => {
        ctx.beginPath();
        ctx.moveTo(tx, waveY - waveHeight - 8);
        ctx.lineTo(tx, waveY + waveHeight + 8);
        ctx.stroke();
      });
      ctx.restore();
  // Draw bottom bar border
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, waveY + waveHeight + 44);
  ctx.lineTo(width, waveY + waveHeight + 44);
  ctx.stroke();

  // Draw labels
  ctx.font = 'bold 1.05rem Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#222';
  ctx.fillText('Ultraviolet', visStart / 2, labelY);
  ctx.fillText('Visible Spectrum', (visStart + visEnd) / 2, labelY);
  ctx.fillText('Infrared', (visEnd + width) / 2, labelY);
    }

    let running = true;
    function animate() {
      if (!running) return;
      drawWave(performance.now() - t0);
      requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, [width, height]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ width: '100%', maxWidth: width, display: 'block', margin: '2.2rem auto 0.8rem auto', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      aria-label="Visible spectrum animation"
    />
  );
}
