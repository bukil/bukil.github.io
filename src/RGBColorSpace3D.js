import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { addRGBLabels } from './RGBTextLabel';

export default function RGBColorSpace3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Orthographic camera for orthogonal view
    const aspect = width / height;
    const d = 2.5;
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 0.1, 100
    );
    camera.position.set(2.5, 2.5, 2.5);
    camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

    // Axes helper
    scene.add(new THREE.AxesHelper(1.5));


    // Create RGB cube with accurate vertex colors
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ vertexColors: true, opacity: 0.85, transparent: true });
    const cube = new THREE.Mesh(geometry, material);

    // Assign accurate RGB colors to each vertex
    const position = geometry.attributes.position;
    const colorAttr = new THREE.BufferAttribute(new Float32Array(position.count * 3), 3);
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      // Map -1/1 to 0/1 for RGB
      const r = (x + 1) / 2;
      const g = (y + 1) / 2;
      const b = (z + 1) / 2;
      colorAttr.setXYZ(i, r, g, b);
    }
    geometry.setAttribute('color', colorAttr);
  scene.add(cube);
  // Add 3D RGB axis labels
  addRGBLabels(scene);

  // Orbit controls (no zoom)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = camera.position.length();
  controls.maxDistance = camera.position.length();
  controls.enableZoom = false;
  controls.target.set(0, 0, 0);
  controls.update();

    // Animate
    let rafId;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 0);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '400px', height: '400px' }} />;
}
