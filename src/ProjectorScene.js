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
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.update();

    // --- Restrict mouse interaction to a small central zone of the canvas ---
    // Adjust this fraction (0 < fraction <= 1) to change interactive region size.
    const INTERACTIVE_FRACTION = 0.4; // 40% of width & height centered
    let lastInside = false;

    function updateControlsRegion(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const xNorm = x / rect.width;
      const yNorm = y / rect.height;
      const half = INTERACTIVE_FRACTION / 2;
      const inside = xNorm >= 0.5 - half && xNorm <= 0.5 + half && yNorm >= 0.5 - half && yNorm <= 0.5 + half;
      if (inside !== lastInside) {
        controls.enabled = inside; // Only allow OrbitControls inside region
        renderer.domElement.style.cursor = inside ? 'grab' : 'default';
        lastInside = inside;
      }
    }

    function handlePointerMove(e) {
      updateControlsRegion(e.clientX, e.clientY);
    }

    function handlePointerDown(e) {
      updateControlsRegion(e.clientX, e.clientY);
      // If outside region, let event bubble so page interactions continue
      if (!controls.enabled) return; // inside region -> OrbitControls will capture
    }

    function handleWheel(e) {
      // Re-evaluate region (wheel can occur without pointermove on some devices)
      updateControlsRegion(e.clientX, e.clientY);
      if (!controls.enabled) {
        // Allow page scroll (do not preventDefault)
        return;
      }
      // Inside interactive zone: let OrbitControls process zoom (it already attaches a wheel listener)
    }

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown, { capture: true });
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: true });

    // Initialize state (center assumed; set enabled=false until pointer enters)
    controls.enabled = false;
    renderer.domElement.style.cursor = 'default';

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

    // Use the colors.png texture from the original reference example
    new THREE.TextureLoader().load('https://threejs.org/examples/textures/colors.png', tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
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
  renderer.domElement.removeEventListener('pointermove', handlePointerMove);
  renderer.domElement.removeEventListener('pointerdown', handlePointerDown, { capture: true });
  renderer.domElement.removeEventListener('wheel', handleWheel, { passive: true });
  controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
