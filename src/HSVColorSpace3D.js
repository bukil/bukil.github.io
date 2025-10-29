import { useEffect, useRef, useState } from 'react';
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

export default function HSVColorSpace3D({ hueDeg = 0, ballHeight = 1, radiusPct = 100 }) {
  const mountRef = useRef(null);
  // external control props (hueDeg in degrees, ballHeight 0..1, radiusPct 0..100)
  const hueRef = useRef(hueDeg);
  const ballHeightRef = useRef(ballHeight);
  const radiusRef = useRef(radiusPct / 100);

  // keep refs in sync with props
  useEffect(() => { hueRef.current = hueDeg; }, [hueDeg]);
  useEffect(() => { ballHeightRef.current = ballHeight; }, [ballHeight]);
  useEffect(() => { radiusRef.current = radiusPct / 100; }, [radiusPct]);

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
    // Radial strip from center to outer ring showing saturation (s) at current hue
    const stripLength = ringOuterRadius; // from center to outer ring
    const stripThickness = 0.18;
    const stripSegments = 64;
    const stripGeom = new THREE.PlaneGeometry(stripLength, stripThickness, stripSegments, 1);
    // rotate to lie flat on top cap
    stripGeom.rotateX(-Math.PI / 2);
    // move so inner edge is at center (plane is centered by default)
    const stripMesh = new THREE.Mesh(stripGeom, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
    stripMesh.position.set(stripLength / 2, heightCyl / 2 + 0.021, 0);
    // color vertices by saturation (0 at inner edge to 1 at outer edge) using initial hue
    const stripPos = stripGeom.attributes.position;
    const stripColorArr = new Float32Array(stripPos.count * 3);
    const initialHueForStrip = (hueRef.current % 360 + 360) % 360 / 360;
    for (let i = 0; i < stripPos.count; i++) {
      const vx = stripPos.getX(i); // ranges -stripLength/2 .. +stripLength/2
      // compute saturation from center to outer edge
      const s = Math.min(Math.max((vx + stripLength / 2) / stripLength, 0), 1);
      const [sr, sg, sb] = hsvToRgb(initialHueForStrip, s, 1);
      stripColorArr[i * 3 + 0] = sr;
      stripColorArr[i * 3 + 1] = sg;
      stripColorArr[i * 3 + 2] = sb;
    }
    const stripColorAttr = new THREE.BufferAttribute(stripColorArr, 3);
    stripGeom.setAttribute('color', stripColorAttr);
    scene.add(stripMesh);
    // Add a small sphere (dot) on the outer ring
    const dotRadius = 0.09;
    const dotGeom = new THREE.SphereGeometry(dotRadius, 24, 24);
    // initial hue and height (from refs)
    const initialHue = hueRef.current || 0; // 0..1
    const initialBallHeight = ballHeightRef.current || 1; // 0..1
    const [dotR, dotG, dotB] = hsvToRgb(initialHue, 1, 1);
    const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(dotR, dotG, dotB) });
    const dotMesh = new THREE.Mesh(dotGeom, dotMat);
    const dotAngle = initialHue * 2 * Math.PI;
  const initialRadius = radiusRef.current !== undefined ? radiusRef.current : 1;
  // dot radial distance should travel from cylinder center (0) to outer ring radius
  const dotRingRadius = initialRadius * ringOuterRadius;
    const initialY = initialBallHeight * heightCyl - heightCyl / 2;
    dotMesh.position.set(
      dotRingRadius * Math.cos(dotAngle),
      initialY,
      dotRingRadius * Math.sin(dotAngle)
    );
    scene.add(dotMesh);

    // Vertical color bar to the right of the cylinder (shows value gradient for current hue)
    const barWidth = 0.18;
    const barHeight = heightCyl;
    const barSegments = 64;
    const barGeom = new THREE.PlaneGeometry(barWidth, barHeight, 1, barSegments);
    // rotate so plane faces -X and stands vertically
    barGeom.rotateY(Math.PI / 2);
    // position at right side
    const barX = ringOuterRadius + 0.18 + barWidth / 2;
    const barMeshPosY = 0;
    // build initial color attribute (will be updated in animate)
    const barPos = barGeom.attributes.position;
    const barColorArr = new Float32Array(barPos.count * 3);
    // initialize with hue = initialHue
    for (let i = 0; i < barPos.count; i++) {
      const vx = barPos.getX(i);
      const vy = barPos.getY(i);
      // vy ranges -barHeight/2 .. +barHeight/2
      const v = (vy + barHeight / 2) / barHeight; // 0..1
      const [br, bg, bb] = hsvToRgb(initialHue, 1, v);
      barColorArr[i * 3 + 0] = br;
      barColorArr[i * 3 + 1] = bg;
      barColorArr[i * 3 + 2] = bb;
    }
    const barColorAttr = new THREE.BufferAttribute(barColorArr, 3);
    barGeom.setAttribute('color', barColorAttr);
    const barMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const verticalBar = new THREE.Mesh(barGeom, barMat);
    verticalBar.position.set(barX, barMeshPosY, 0);
    scene.add(verticalBar);
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
      // read latest hue from hueRef and update dot
      const h = (hueRef.current % 360 + 360) % 360 / 360; // normalize 0..1
      const [r, g, b] = hsvToRgb(h, 1, 1);
      if (dotMesh && dotMesh.material) {
        // update color
        dotMesh.material.color.setRGB(r, g, b);
        // determine vertical position from ballHeightRef (0..1)
        const bh = Math.min(Math.max(ballHeightRef.current, 0), 1);
        const yPos = bh * heightCyl - heightCyl / 2;
  // determine radial position from radiusRef (0..1) measured from center to outer ring
  const rr = Math.min(Math.max(radiusRef.current, 0), 1);
  const currentRingRadius = rr * ringOuterRadius;
        dotMesh.position.set(
          currentRingRadius * Math.cos(h * 2 * Math.PI),
          yPos,
          currentRingRadius * Math.sin(h * 2 * Math.PI)
        );
      }
      // update vertical bar colors to show value gradient for current hue
      if (barPos && barColorAttr) {
        for (let i = 0; i < barPos.count; i++) {
          const vy = barPos.getY(i);
          const vval = (vy + barHeight / 2) / barHeight;
          const [br, bg, bb] = hsvToRgb(h, 1, vval);
          barColorArr[i * 3 + 0] = br;
          barColorArr[i * 3 + 1] = bg;
          barColorArr[i * 3 + 2] = bb;
        }
        barColorAttr.needsUpdate = true;
      }
      // update radial strip colors to reflect current hue (saturation across length)
      if (stripPos && stripColorAttr) {
        for (let i = 0; i < stripPos.count; i++) {
          const vx = stripPos.getX(i);
          const s = Math.min(Math.max((vx + stripLength / 2) / stripLength, 0), 1);
          const [sr, sg, sb] = hsvToRgb(h, s, 1);
          stripColorArr[i * 3 + 0] = sr;
          stripColorArr[i * 3 + 1] = sg;
          stripColorArr[i * 3 + 2] = sb;
        }
        stripColorAttr.needsUpdate = true;
      }
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

  // component now renders only the canvas; controls should be placed in the parent
  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
