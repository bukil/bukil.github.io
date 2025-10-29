import * as THREE from 'three';
import * as React from 'react';
import { useGLTF } from '@react-three/drei';

export function HSVColorModel({ scale = 1.2, position = [0, 0, 0] }) {
  const { scene } = useGLTF(process.env.PUBLIC_URL + '/3d/HSV.glb');

  // Do not override material; use GLB's own shader/color

  return <primitive object={scene} scale={scale} position={position} />;
}
