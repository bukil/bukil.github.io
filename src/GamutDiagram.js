import React from 'react';

const GamutDiagram = () => {
  // Dimensions
  const width = 600;
  const height = 650;
  const padding = 60;
  
  // Scales
  // x: 0 to 0.8
  // y: 0 to 0.9
  const scaleX = (x) => padding + (x / 0.8) * (width - 2 * padding);
  const scaleY = (y) => height - padding - (y / 0.9) * (height - 2 * padding);

  // Spectral Locus Points (approximate 380-700nm)
  const locusPoints = [
    [0.1741, 0.0050], // 380
    [0.1733, 0.0048], // 400
    [0.1689, 0.0091], // 420
    [0.1566, 0.0177], // 450
    [0.0913, 0.1327], // 480
    [0.0082, 0.5384], // 500
    [0.0743, 0.8338], // 520
    [0.2296, 0.7543], // 540
    [0.3731, 0.6245], // 560
    [0.5125, 0.4866], // 580
    [0.6270, 0.3725], // 600
    [0.6915, 0.3083], // 620
    [0.7347, 0.2653]  // 700
  ];

  // Create smooth path for locus using Catmull-Rom spline interpolation
  const getSmoothPath = (points) => {
    if (points.length < 2) return "";
    
    // Convert to screen coordinates
    const screenPoints = points.map(p => [scaleX(p[0]), scaleY(p[1])]);
    
    let d = `M ${screenPoints[0][0]},${screenPoints[0][1]}`;
    
    const tension = 0.2;
    
    for (let i = 0; i < screenPoints.length - 1; i++) {
      const p0 = i > 0 ? screenPoints[i - 1] : screenPoints[i];
      const p1 = screenPoints[i];
      const p2 = screenPoints[i + 1];
      const p3 = i < screenPoints.length - 2 ? screenPoints[i + 2] : p2;
      
      const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
      const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
      
      const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
      const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
      
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    
    return d + " Z";
  };

  const locusPathData = getSmoothPath(locusPoints);

  // sRGB Triangle
  const sRGB = {
    r: [0.64, 0.33],
    g: [0.30, 0.60],
    b: [0.15, 0.06],
    w: [0.3127, 0.3290]
  };

  const trianglePath = `M ${scaleX(sRGB.r[0])},${scaleY(sRGB.r[1])} L ${scaleX(sRGB.g[0])},${scaleY(sRGB.g[1])} L ${scaleX(sRGB.b[0])},${scaleY(sRGB.b[1])} Z`;

  // Grid lines
  const gridLines = [];
  for (let i = 0; i <= 0.801; i += 0.05) { // Minor grid
    gridLines.push(<line key={`v_minor_${i}`} x1={scaleX(i)} y1={scaleY(0)} x2={scaleX(i)} y2={scaleY(0.9)} stroke="#f5f5f5" strokeWidth="1" />);
  }
  for (let i = 0; i <= 0.901; i += 0.05) { // Minor grid
    gridLines.push(<line key={`h_minor_${i}`} x1={scaleX(0)} y1={scaleY(i)} x2={scaleX(0.8)} y2={scaleY(i)} stroke="#f5f5f5" strokeWidth="1" />);
  }
  for (let i = 0; i <= 0.801; i += 0.1) { // Major grid
    gridLines.push(<line key={`v_${i}`} x1={scaleX(i)} y1={scaleY(0)} x2={scaleX(i)} y2={scaleY(0.9)} stroke="#e0e0e0" strokeWidth="1" />);
  }
  for (let i = 0; i <= 0.901; i += 0.1) { // Major grid
    gridLines.push(<line key={`h_${i}`} x1={scaleX(0)} y1={scaleY(i)} x2={scaleX(0.8)} y2={scaleY(i)} stroke="#e0e0e0" strokeWidth="1" />);
  }

  return (
    <div className="gamut-diagram" style={{ width: '100%', maxWidth: '600px', margin: '2rem auto', fontFamily: "'Courier New', monospace" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#d0f0d0" strokeWidth="1" />
          </pattern>
          
          <clipPath id="triangleClip">
            <path d={trianglePath} />
          </clipPath>
        </defs>

        {/* Background Grid */}
        {gridLines}

        {/* Axes */}
        <line x1={scaleX(0)} y1={scaleY(0)} x2={scaleX(0.8)} y2={scaleY(0)} stroke="black" strokeWidth="1.5" />
        <line x1={scaleX(0)} y1={scaleY(0)} x2={scaleX(0)} y2={scaleY(0.9)} stroke="black" strokeWidth="1.5" />

        {/* Axis Labels */}
        {/* X Axis */}
        {[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map(v => (
          <text key={`x${v}`} x={scaleX(v)} y={scaleY(0) + 20} textAnchor="middle" fontSize="12" fill="#666">{v.toFixed(1)}</text>
        ))}
        <text x={scaleX(0.4)} y={scaleY(0) + 45} textAnchor="middle" fontWeight="bold" fontSize="14">x</text>

        {/* Y Axis */}
        {[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(v => (
          <text key={`y${v}`} x={scaleX(0) - 10} y={scaleY(v) + 4} textAnchor="end" fontSize="12" fill="#666">{v.toFixed(1)}</text>
        ))}
        <text x={scaleX(0) - 40} y={scaleY(0.45)} textAnchor="middle" fontWeight="bold" fontSize="14" transform={`rotate(-90, ${scaleX(0) - 40}, ${scaleY(0.45)})`}>y</text>

        {/* CIE XYZ Horseshoe */}
        {/* Fill with hatching */}
        <path d={locusPathData} fill="url(#hatch)" stroke="black" strokeWidth="1.5" />
        
        {/* sRGB Triangle with Color Mixing */}
        <g clipPath="url(#triangleClip)">
            {/* Base black */}
            <rect x="0" y="0" width={width} height={height} fill="black" />
            
            {/* Red Gradient */}
            <circle cx={scaleX(sRGB.r[0])} cy={scaleY(sRGB.r[1])} r={width * 0.8} fill="red" style={{mixBlendMode: 'screen'}} />
            {/* Green Gradient */}
            <circle cx={scaleX(sRGB.g[0])} cy={scaleY(sRGB.g[1])} r={width * 0.8} fill="#00ff00" style={{mixBlendMode: 'screen'}} />
            {/* Blue Gradient */}
            <circle cx={scaleX(sRGB.b[0])} cy={scaleY(sRGB.b[1])} r={width * 0.8} fill="blue" style={{mixBlendMode: 'screen'}} />
        </g>
        
        {/* Triangle Outline */}
        <path d={trianglePath} fill="none" stroke="black" strokeWidth="1.5" />

        {/* Points */}
        <circle cx={scaleX(sRGB.r[0])} cy={scaleY(sRGB.r[1])} r={5} fill="#ff3333" stroke="black" strokeWidth="1" />
        <circle cx={scaleX(sRGB.g[0])} cy={scaleY(sRGB.g[1])} r={5} fill="#33ff33" stroke="black" strokeWidth="1" />
        <circle cx={scaleX(sRGB.b[0])} cy={scaleY(sRGB.b[1])} r={5} fill="#3333ff" stroke="black" strokeWidth="1" />
        <circle cx={scaleX(sRGB.w[0])} cy={scaleY(sRGB.w[1])} r={5} fill="white" stroke="black" strokeWidth="1" />

        {/* Labels */}
        {/* CIE XYZ Label */}
        <g transform={`translate(${scaleX(0.25)}, ${scaleY(0.85)})`}>
            <text x="0" y="0" fontSize="14" fontFamily="monospace">CIE XYZ</text>
            <line x1="10" y1="5" x2="10" y2="40" stroke="black" strokeWidth="1" />
        </g>

        {/* SRGB Label */}
        <g transform={`translate(${scaleX(0.55)}, ${scaleY(0.55)})`}>
            <text x="0" y="0" fontSize="14" fontFamily="monospace">SRGB</text>
            <line x1="10" y1="5" x2="-50" y2="60" stroke="black" strokeWidth="1" />
        </g>

      </svg>
    </div>
  );
};

export default GamutDiagram;
