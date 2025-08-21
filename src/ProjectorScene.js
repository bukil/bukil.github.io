import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

// Three.js projector-like spotlight scene inside a React component
export default function ProjectorScene() {
  const mountRef = useRef(null);
  const buttonsRef = useRef(null);

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

    // --- Projection texture variants ---
  const loader = new THREE.TextureLoader();
  const textureVariants = { base: null, disturb: null, tex1: null };
  const cycleOrder = ['base','disturb','tex1'];
  let activeKey = 'base';

    // Base texture (existing colors grid)
    loader.load('https://threejs.org/examples/textures/colors.png', tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      textureVariants.base = tex;
      if (activeKey === 'base') spot.map = tex;
    });

  // Disturb procedural noise (dynamic canvas)
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 256; noiseCanvas.height = 256;
    const nctx = noiseCanvas.getContext('2d');
    const noiseTexture = new THREE.CanvasTexture(noiseCanvas);
    noiseTexture.colorSpace = THREE.SRGBColorSpace;
    noiseTexture.minFilter = THREE.LinearFilter;
    noiseTexture.magFilter = THREE.LinearFilter;
    textureVariants.disturb = noiseTexture;
    let lastNoiseTime = 0;
    function updateNoise(time) {
      if (time - lastNoiseTime < 110) return; // update ~9fps
      lastNoiseTime = time;
      const w = noiseCanvas.width, h = noiseCanvas.height;
      const imgData = nctx.createImageData(w, h);
      for (let i = 0; i < imgData.data.length; i += 4) {
        // layered turbulence-ish value
        const x = (i/4) % w;
        const y = ((i/4) / w)|0;
        const v = (
          128 + 90 * Math.sin(x * 0.07 + time * 0.0008) * Math.sin(y * 0.05 + time * 0.0013) +
          40 * Math.sin((x+y) * 0.12 + time * 0.0006)
        );
        // blue-ish caustic feel
        imgData.data[i] = v * 0.3;      // R
        imgData.data[i+1] = v * 0.8;    // G
        imgData.data[i+2] = 180 + v * 0.2; // B
        imgData.data[i+3] = 255;        // A
      }
      nctx.putImageData(imgData, 0, 0);
      noiseTexture.needsUpdate = true;
    }

    // Local image texture (texture1.jpg in /public)
    loader.load('/texture1.jpg', tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      textureVariants.tex1 = tex;
      if (activeKey === 'tex1') spot.map = tex;
    });

    function applyTexture(key) {
      activeKey = key;
      spot.map = textureVariants[key];
      switch (key) {
        case 'disturb':
          renderer.toneMappingExposure = 1.35; spot.intensity = 1100; break;
        case 'tex1':
          renderer.toneMappingExposure = 1.28; spot.intensity = 1050; break;
        default:
          renderer.toneMappingExposure = 1.25; spot.intensity = 1000; break;
      }
      // update single switch visual
      if (buttonsRef.current) {
        const btn = buttonsRef.current;
        if (key === 'disturb') {
          btn.style.background = 'rgba(30,140,255,0.25)';
          btn.style.borderColor = 'rgba(30,140,255,0.55)';
        } else if (key === 'tex1') {
          btn.style.background = 'rgba(255,170,60,0.22)';
          btn.style.borderColor = 'rgba(255,170,60,0.55)';
        } else {
          btn.style.background = 'rgba(255,255,255,0.12)';
          btn.style.borderColor = 'rgba(255,255,255,0.35)';
        }
      }
    }

    // Single circular toggle button (no text)
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-label', 'Toggle projection texture');
    Object.assign(toggleBtn.style, {
      position: 'absolute', top: '10px', right: '12px',
      width: '42px', height: '42px', borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.12)', cursor: 'pointer',
      display: 'block', padding: '0',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      transition: 'background .35s, border-color .35s, transform .25s', zIndex: '10'
    });
    toggleBtn.onmouseenter = () => { toggleBtn.style.transform='scale(1.08)'; };
    toggleBtn.onmouseleave = () => { toggleBtn.style.transform='scale(1)'; };
    toggleBtn.onmousedown = () => { toggleBtn.style.transform='scale(.9)'; };
    toggleBtn.onmouseup = () => { toggleBtn.style.transform='scale(1.08)'; };
    toggleBtn.onclick = () => {
      // cycle through textures
      const idx = cycleOrder.indexOf(activeKey);
      const next = cycleOrder[(idx + 1) % cycleOrder.length];
      // If next texture not yet loaded (case for tex1), still switch – map may update when load finishes
      applyTexture(next);
    };
    container.style.position = 'relative';
    container.appendChild(toggleBtn);
    buttonsRef.current = toggleBtn;
  // Initialize visual state
  applyTexture(activeKey);

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
      const now = performance.now();
      const t = now / 3000;
      spot.position.x = Math.cos(t) * 2.5;
      spot.position.z = Math.sin(t) * 2.5;
      spot.target.position.set(0, 1, 0);
      if (activeKey === 'disturb') updateNoise(now);
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
  if (toggleBtn && toggleBtn.parentNode === container) container.removeChild(toggleBtn);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'relative', width: '100%', height: '100%' }} />;
}
