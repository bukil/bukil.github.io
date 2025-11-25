import React, { useState, useMemo, useRef, useEffect } from 'react';

function hexToRgbNorm(hex) {
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16)/255;
  const g = parseInt(h.substring(2,4),16)/255;
  const b = parseInt(h.substring(4,6),16)/255;
  return [r,g,b];
}
function rgbNormToHex([r,g,b]){
  const to255 = v => Math.round(Math.max(0,Math.min(1,v))*255);
  const pad = n => n.toString(16).padStart(2,'0');
  return '#'+pad(to255(r))+pad(to255(g))+pad(to255(b));
}

// Approximate hue extraction (0-360) for mapping to pseudo physical wavelength
function hexToHue(hex){
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16)/255;
  const g = parseInt(h.slice(2,4),16)/255;
  const b = parseInt(h.slice(4,6),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  if(max === min) return 0; // achromatic -> treat as red end
  const d = max - min;
  let hue;
  switch(max){
    case r: hue = ( (g - b)/d + (g < b ? 6 : 0) ); break;
    case g: hue = ( (b - r)/d + 2 ); break;
    case b: hue = ( (r - g)/d + 4 ); break;
    default: hue = 0;
  }
  hue *= 60;
  return hue;
}

export default function ColorMixer(){
  const [colorA, setColorA] = useState('#ff0000');
  const [colorB, setColorB] = useState('#00ff00');
  const [mode, setMode] = useState('additive'); // 'additive' or 'subtractive'

  const mixed = useMemo(()=>{
    // Helper: sRGB <-> linear
    const srgbToLinear = c => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4);
    const linearToSrgb = c => c <= 0.0031308 ? 12.92*c : 1.055*Math.pow(c,1/2.4)-0.055;
    // Convert hex to linear RGB triple
    const toLinear = hex => {
      const [r,g,b] = hexToRgbNorm(hex);
      return [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
    };
    // Additive mixing (physically: intensities sum in linear space then clamp)
    function additiveMix(h1,h2){
      const A = toLinear(h1); const B = toLinear(h2);
      const R = Math.min(1, A[0] + B[0]);
      const G = Math.min(1, A[1] + B[1]);
      const Bc = Math.min(1, A[2] + B[2]);
      return rgbNormToHex([linearToSrgb(R), linearToSrgb(G), linearToSrgb(Bc)]);
    }
    // CMY-style subtractive mixing (overlay-like): convert to linear CMY, combine inks, convert back
    function subtractiveMix(h1,h2){
      const [r1s,g1s,b1s] = hexToRgbNorm(h1);
      const [r2s,g2s,b2s] = hexToRgbNorm(h2);
      const r1 = srgbToLinear(r1s), g1 = srgbToLinear(g1s), b1 = srgbToLinear(b1s);
      const r2 = srgbToLinear(r2s), g2 = srgbToLinear(g2s), b2 = srgbToLinear(b2s);
      const clamp01 = v => Math.max(0, Math.min(1, v));
      // CMY in linear space
      const c1 = 1 - r1, m1 = 1 - g1, y1 = 1 - b1;
      const c2 = 1 - r2, m2 = 1 - g2, y2 = 1 - b2;
      // Combine inks: more ink -> higher coverage (like overprint / screen blend inverse)
      const C = 1 - (1 - c1) * (1 - c2);
      const M = 1 - (1 - m1) * (1 - m2);
      const Y = 1 - (1 - y1) * (1 - y2);
      // Back to linear RGB
      const rL = clamp01(1 - C);
      const gL = clamp01(1 - M);
      const bL = clamp01(1 - Y);
      return rgbNormToHex([linearToSrgb(rL), linearToSrgb(gL), linearToSrgb(bL)]);
    }
    if(mode === 'additive'){
      return additiveMix(colorA,colorB);
    } else {
      return subtractiveMix(colorA,colorB);
    }
  }, [colorA, colorB, mode]);

  // Derive numeric displays
  function toRgbDisplay(hex){
    const n = hexToRgbNorm(hex).map(v=>Math.round(v*255));
    return `rgb(${n[0]}, ${n[1]}, ${n[2]})`;
  }

  function toCmyDisplay(hex){
    const n = hexToRgbNorm(hex).map(v=>Math.round((1-v)*100));
    return `cmy(${n[0]}%, ${n[1]}%, ${n[2]}%)`;
  }

  const [showLens, setShowLens] = useState(false);
  const lensCanvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(()=>{
    if(!showLens) { if(rafRef.current) cancelAnimationFrame(rafRef.current); return; }
    const canvas = lensCanvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;
    const W = canvas.width;
    const H = canvas.height;

    // Pre-generate molecules for subtractive mode (each molecule has atoms + rotation)
    const palette = ['#00bcd4','#ff00aa','#ffe600'];
    const molecules = Array.from({length: 10}).map(()=>{
      const atomCount = 3 + Math.floor(Math.random()*3); // 3–5 atoms
      const atoms = Array.from({length: atomCount}).map((_,k)=>{
        const radius = 12 + Math.random()*26; // distance from center
        const angle = Math.random()*Math.PI*2;
        return {
          offsetR: radius,
          offsetA: angle,
          size: 6 + Math.random()*5,
          color: palette[Math.floor(Math.random()*palette.length)]
        };
      });
      return {
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()*2-1)*0.04,
        vy: (Math.random()*2-1)*0.04,
        rot: Math.random()*Math.PI*2,
        rotSpeed: (Math.random()*2-1)*0.004,
        atoms
      };
    });

    function drawAdditive(){
      ctx.clearRect(0,0,W,H);
      ctx.globalCompositeOperation = 'lighter';
      const toRGBA = (hex, a=0.6) => {
        const h = hex.replace('#','');
        const r = parseInt(h.slice(0,2),16);
        const g = parseInt(h.slice(2,4),16);
        const b = parseInt(h.slice(4,6),16);
        return `rgba(${r},${g},${b},${a})`;
      };
      // Map hue -> approximate wavelength (nm) range 400-650 then derive freq/speed
      function waveParams(hex, baseAmp, alpha){
        const hue = hexToHue(hex); // 0..360
        const lambda = 650 - (hue/360)*250; // red ~650nm, violet ~400nm
        const norm = (650 - lambda)/250; // 0 (red) .. 1 (violet)
        // Increase frequency range so wavelengths are visibly shorter and more distinct
        const freq = 0.050 + norm*0.230; // 0.050 .. 0.280
        // Slightly higher temporal speed range to match tighter waves
        const speed = 0.40 + norm*0.60; // 0.40 .. 1.00
        return { amp: baseAmp, freq, speed, color: toRGBA(hex, alpha) };
      }
      const waves = [
        waveParams(colorA,18,0.55),
        waveParams(colorB,14,0.55),
        waveParams(mixed,10,0.50)
      ];
      waves.forEach((w,i)=>{
        ctx.beginPath();
        for(let x=0;x<W;x+=1){
          const y = H/2 + Math.sin((x*w.freq) + t*w.speed + i)*w.amp;
          if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
      });
      // Overlay blended center ellipse
      const grd = ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,70);
      grd.addColorStop(0,toRGBA(mixed,0.65));
      grd.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.ellipse(W/2,H/2,70,40,0,0,Math.PI*2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    function drawSubtractive(){
      ctx.clearRect(0,0,W,H);
      // Slight dyed paper background
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillRect(0,0,W,H);
      // Update molecules positions/rotation
      molecules.forEach(m=>{
        m.x += m.vx; m.y += m.vy; m.rot += m.rotSpeed;
        if(m.x < -40) m.x = W+40; if(m.x > W+40) m.x = -40;
        if(m.y < -40) m.y = H+40; if(m.y > H+40) m.y = -40;
      });
      // Draw molecules: bonds then atoms with multiply blending for subtractive absorption effect
      ctx.globalCompositeOperation = 'multiply';
      molecules.forEach(m=>{
        // Compute screen positions for atoms
        const atomPositions = m.atoms.map(a=>{
          const ax = m.x + Math.cos(a.offsetA + m.rot)*a.offsetR;
          const ay = m.y + Math.sin(a.offsetA + m.rot)*a.offsetR;
          return { ax, ay, size: a.size, color: a.color };
        });
        // Bonds: connect each atom to next (ring) + center nucleus
        if(atomPositions.length > 1){
          ctx.strokeStyle = 'rgba(60,60,60,0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          atomPositions.forEach((p,i)=>{
            const q = atomPositions[(i+1)%atomPositions.length];
            ctx.moveTo(p.ax,p.ay); ctx.lineTo(q.ax,q.ay);
          });
          ctx.stroke();
        }
        // Nucleus
        ctx.beginPath();
        ctx.arc(m.x,m.y,4,0,Math.PI*2);
        ctx.fillStyle = 'rgba(40,40,40,0.5)';
        ctx.fill();
        // Radial bonds to nucleus
        ctx.strokeStyle = 'rgba(50,50,50,0.3)';
        ctx.lineWidth = 1.5;
        atomPositions.forEach(p=>{
          ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(p.ax,p.ay); ctx.stroke();
        });
        // Atoms
        atomPositions.forEach(p=>{
          ctx.beginPath(); ctx.arc(p.ax,p.ay,p.size,0,Math.PI*2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });
      });
      // Restore normal blend for overlays
      ctx.globalCompositeOperation = 'source-over';
      // Dark core
      const grd = ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,80);
      grd.addColorStop(0,'rgba(0,0,0,0.35)');
      grd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(W/2,H/2,80,0,Math.PI*2); ctx.fill();
      // Light highlight ring to suggest structural boundary
      ctx.beginPath(); ctx.arc(W/2,H/2,81,0,Math.PI*2);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5; ctx.stroke();
    }

    function loop(){
      // Fast temporal progression in additive mode (scaled by color-specific waveParams speeds)
      t += (mode==='additive' ? 0.05 : 0.003);
      if(mode==='additive') drawAdditive(); else drawSubtractive();
      rafRef.current = requestAnimationFrame(loop);
    }
    loop();
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [showLens, mode, colorA, colorB, mixed]);

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '1rem', flexWrap: 'wrap' }}>
      <div style={{ minWidth: 260 }}>
        <h4 className="credits-title" style={{ fontSize: '1rem', margin: '0 0 0.6rem 0' }}>Interactive Colour Mixer</h4>
        <p className="intro-text" style={{ fontSize: 13 }}>Choose two colours and a mixing mode. <b>Additive</b> simulates mixing light (RGB add). <b>Subtractive</b> simulates mixing pigments (CMY-style overlay).</p>
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.6rem', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12 }}>Colour A</label>
            <input aria-label="Colour A" type="color" value={colorA} onChange={e=>setColorA(e.target.value)} />
            <div style={{ marginTop: 6, fontSize: 12 }}>{toRgbDisplay(colorA)}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{toCmyDisplay(colorA)}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12 }}>Colour B</label>
            <input aria-label="Colour B" type="color" value={colorB} onChange={e=>setColorB(e.target.value)} />
            <div style={{ marginTop: 6, fontSize: 12 }}>{toRgbDisplay(colorB)}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{toCmyDisplay(colorB)}</div>
          </div>
        </div>
        <div style={{ marginTop: '0.8rem' }}>
          <label style={{ marginRight: 12 }}><input type="radio" name="mode" checked={mode==='additive'} onChange={()=>setMode('additive')} /> Additive</label>
          <label><input type="radio" name="mode" checked={mode==='subtractive'} onChange={()=>setMode('subtractive')} /> Subtractive</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ width: 120, height: 120, borderRadius: 8, background: colorA, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}} aria-label={`Colour A ${toRgbDisplay(colorA)}`}>
          <div style={{ fontSize: 12, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>A</div>
        </div>
        <div aria-hidden="true" style={{ fontSize: 34, fontWeight: 600, lineHeight: '1', padding: '0 4px', userSelect: 'none', color: '#444' }}>+</div>
        <div style={{ width: 120, height: 120, borderRadius: 8, background: colorB, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}} aria-label={`Colour B ${toRgbDisplay(colorB)}`}>
          <div style={{ fontSize: 12, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>B</div>
        </div>
        <div aria-hidden="true" style={{ fontSize: 34, fontWeight: 600, lineHeight: '1', padding: '0 4px', userSelect: 'none', color: '#444' }}>=</div>
        <div
          style={{ position: 'relative', width: 140, height: 140, borderRadius: 8, background: mixed, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', overflow: 'hidden', cursor: 'zoom-in' }}
          onMouseEnter={()=>setShowLens(true)}
          onMouseLeave={()=>setShowLens(false)}
          aria-label={mode==='additive' ? 'Additive mix result – hover to view light wave interaction' : 'Subtractive mix result – hover to view pigment structure'}
        >
          <div style={{ fontSize: 12, color: '#111', fontWeight: 700, pointerEvents: 'none' }}>{mode === 'additive' ? 'Light mix' : 'Pigment mix'}</div>
          <div style={{ marginTop: 6, fontSize: 12, pointerEvents: 'none' }}>{mixed}</div>
          {mode === 'subtractive' && (
            <div style={{ fontSize: 12, color: '#333', pointerEvents: 'none' }}>{toCmyDisplay(mixed)}</div>
          )}
          {showLens && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.12)' }}>
              <div style={{ width: 132, height: 132, borderRadius: '50%', boxShadow: '0 4px 18px rgba(0,0,0,0.25)', border: '2px solid rgba(255,255,255,0.6)', overflow: 'hidden', background: mode==='additive' ? 'radial-gradient(circle at 50% 50%, #ffffff 0%, '+mixed+' 120%)' : mixed }}>
                <canvas ref={lensCanvasRef} width={132} height={132} style={{ width: '132px', height: '132px', display: 'block' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
