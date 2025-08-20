import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

// Three.js projector-like spotlight scene inside a React component
export default function ProjectorScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7, 4, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
  // Clamp pixel ratio to avoid huge GPU cost on very dense screens
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    renderer.domElement.classList.add('three-canvas');

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    controls.target.set(0, 1, 0);
    controls.update();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.25));

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

  const spot = new THREE.SpotLight(0xffffff, 1000, 0, Math.PI / 5.5, 1, 2);
    spot.position.set(2.5, 5, 2.5);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    spot.shadow.bias = -0.0015;
    scene.add(spot);
    scene.add(spot.target);

    new THREE.TextureLoader().load('https://threejs.org/examples/textures/uv_grid_opengl.jpg', tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      spot.map = tex;
    });

    new PLYLoader().load('https://threejs.org/examples/models/ply/binary/Lucy100k.ply', geometry => {
      geometry.scale(0.0024, 0.0024, 0.0024);
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.05 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = -Math.PI / 2;
      mesh.position.y = 0.8;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    // Responsive resize (window + element size changes)
    const resize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', resize);
    // ResizeObserver for container (captures flex/layout changes not triggering window resize)
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    let rafId;
    const animate = () => {
      const t = performance.now() / 3000;
      spot.position.x = Math.cos(t) * 2.5;
      spot.position.z = Math.sin(t) * 2.5;
      spot.target.position.set(0, 1, 0);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

  // Initial size sync in case fonts/layout shift after mount
  setTimeout(resize, 0);

    return () => {
      cancelAnimationFrame(rafId);
  window.removeEventListener('resize', resize);
  ro.disconnect();
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
