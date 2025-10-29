import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function hsvToRgb(h, s, v) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return [r, g, b];
}

export default function HSVColorSpace3D() {
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

    // Cylinder geometry for HSV
    const radius = 1.2;
    const heightCyl = 2.4;
    const radialSegments = 64;
    const heightSegments = 32;
    // Cylinder sides
    const geometry = new THREE.CylinderGeometry(radius, radius, heightCyl, radialSegments, heightSegments, true);
    const position = geometry.attributes.position;
    const colorAttr = new THREE.BufferAttribute(new Float32Array(position.count * 3), 3);
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      // Convert cylindrical coordinates to HSV
      const h = (Math.atan2(z, x) + Math.PI) / (2 * Math.PI); // angle
      const s = Math.sqrt(x * x + z * z) / radius; // radius
      const v = (y + heightCyl / 2) / heightCyl; // height
      const [r, g, b] = hsvToRgb(h, s, v);
      colorAttr.setXYZ(i, r, g, b);
    }
    geometry.setAttribute('color', colorAttr);
    const material = new THREE.MeshBasicMaterial({ vertexColors: true, opacity: 0.85, transparent: true, side: THREE.DoubleSide });
    const cylinder = new THREE.Mesh(geometry, material);
    scene.add(cylinder);

    // Top cap (v=1)
    // Outside hue ring (torus) around cylinder
    const ringInnerRadius = radius + 0.12;
    const ringOuterRadius = radius + 0.28;
    const ringSegments = 128;
    const ringGeom = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, ringSegments);
    // Color each vertex by hue
    const ringPos = ringGeom.attributes.position;
    const ringColor = new THREE.BufferAttribute(new Float32Array(ringPos.count * 3), 3);
    for (let i = 0; i < ringPos.count; i++) {
      const x = ringPos.getX(i);
      const y = ringPos.getY(i);
      // Flat ring in XZ plane, so use x and y for angle
      const h = (Math.atan2(y, x) + Math.PI) / (2 * Math.PI);
      const [r, g, b] = hsvToRgb(h, 1, 1);
      ringColor.setXYZ(i, r, g, b);
    }
    ringGeom.setAttribute('color', ringColor);
    const ringMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const hueRing = new THREE.Mesh(ringGeom, ringMat);
    hueRing.position.y = heightCyl / 2 + 0.02;
    hueRing.rotation.x = -Math.PI / 2;
    scene.add(hueRing);
    const topCapGeom = new THREE.CircleGeometry(radius, radialSegments * 2); // smoother
    const topCapPos = topCapGeom.attributes.position;
    const topCapColor = new THREE.BufferAttribute(new Float32Array(topCapPos.count * 3), 3);
    for (let i = 0; i < topCapPos.count; i++) {
      const x = topCapPos.getX(i);
      const z = topCapPos.getZ(i);
      // y is always 0 for circle geometry, so we use y = heightCyl/2 for top
      const h = (Math.atan2(z, x) + Math.PI) / (2 * Math.PI);
      const s = Math.min(Math.sqrt(x * x + z * z) / radius, 1.0); // 0 at center, 1 at edge
      const v = 1.0;
      const [r, g, b] = hsvToRgb(h, s, v);
      topCapColor.setXYZ(i, r, g, b);
    }
    topCapGeom.setAttribute('color', topCapColor);
    const topCapMat = new THREE.MeshBasicMaterial({ vertexColors: true, opacity: 1.0, transparent: false, side: THREE.DoubleSide });
    const topCap = new THREE.Mesh(topCapGeom, topCapMat);
    topCap.position.y = heightCyl / 2;
    topCap.rotation.x = -Math.PI / 2;
    scene.add(topCap);

    // Bottom cap (v=0)
    const bottomCapGeom = new THREE.CircleGeometry(radius, radialSegments);
    const bottomCapPos = bottomCapGeom.attributes.position;
    const bottomCapColor = new THREE.BufferAttribute(new Float32Array(bottomCapPos.count * 3), 3);
    for (let i = 0; i < bottomCapPos.count; i++) {
      const x = bottomCapPos.getX(i);
      const y = bottomCapPos.getY(i);
      const z = bottomCapPos.getZ(i);
      const h = (Math.atan2(z, x) + Math.PI) / (2 * Math.PI);
      const s = Math.sqrt(x * x + z * z) / radius;
      const v = 0;
      const [r, g, b] = hsvToRgb(h, s, v);
      bottomCapColor.setXYZ(i, r, g, b);
    }
    bottomCapGeom.setAttribute('color', bottomCapColor);
    const bottomCapMat = new THREE.MeshBasicMaterial({ vertexColors: true, opacity: 0.95, transparent: true, side: THREE.DoubleSide });
    const bottomCap = new THREE.Mesh(bottomCapGeom, bottomCapMat);
    bottomCap.position.y = -heightCyl / 2;
    bottomCap.rotation.x = -Math.PI / 2;
    scene.add(bottomCap);

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
