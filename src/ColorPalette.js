import React from 'react';

function hslCss(h, s, l) {
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorPalette({ type = 'hs', cols = 22, rows = 8, value = 0.9, blue = 0.5 }) {
  // Produce a dense HS (or RG) grid similar to the attached screenshot.
  // Defaults: 22 columns x 8 rows (adjustable via props).
  const colors = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let color = '#ccc';
      if (type === 'hs') {
        // Hue across columns 0..360
        const h = (c / Math.max(1, cols - 1)) * 360;
        // Better lightness mapping to match the reference image:
        // top row ~8% lightness (very dark), bottom row ~92% (very pale)
        const topLight = 8 / 100;
        const bottomLight = 92 / 100;
        const l = topLight + (r / Math.max(1, rows - 1)) * (bottomLight - topLight);
        // Use full saturation for vivid colors but slightly reduce for extreme lights
        // to avoid clipping on very dark or very light rows.
        const s = Math.max(0.88, 1 - Math.abs(0.5 - l));
        color = hslCss(h, s, l);
      } else if (type === 'rg') {
        const R = Math.round((c / Math.max(1, cols - 1)) * 255);
        const G = Math.round((1 - r / Math.max(1, rows - 1)) * 255);
        const B = Math.round(blue * 255);
        color = `rgb(${R}, ${G}, ${B})`;
      }
      colors.push(color);
    }
  }

  const gridStyle = { gridTemplateColumns: `repeat(${cols}, 1fr)` };

  return (
    <div className="color-palette" role="list" aria-label={`Colour palette ${type}`} style={gridStyle}>
      {colors.map((c, i) => (
        <div key={i} role="listitem" className="color-swatch" title={c} aria-label={`colour ${c}`} style={{ background: c }} />
      ))}
    </div>
  );
}
