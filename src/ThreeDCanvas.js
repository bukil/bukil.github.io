// Simple Three.js 3D Canvas using react-three-fiber

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { HSVColorModel } from './HSVColorModel';

export default function ThreeDCanvas({ width = 420, height = 340 }) {
  return (
    <div style={{ width: '100%', height: height, borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 80 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={0.7} />
        <Suspense fallback={null}>
          <HSVColorModel color="#ff0000" />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
