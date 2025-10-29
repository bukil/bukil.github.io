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

export default function HSVColorSpace3D({ hueDeg = 0, ballHeight = 1, radiusPct = 100, markerType = 'sphere' }) {
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
    // SV preview variables (created only for plane marker)
    // make it wider and moved down: width twice the default, height remains default
    let svW = 320; // pixels (wide)
    let svH = 160; // pixels (height)
    let svCanvas = null;
    let svCtx = null;
    let svImage = null;
    let svHost = null;
    if (markerType === 'plane') {
      // determine a host for the SV preview: prefer the controls column (sibling), fallback to the container
      svCanvas = document.createElement('canvas');
      svCanvas.width = svW;
      svCanvas.height = svH;
      svCanvas.style.position = 'absolute';
  // move the preview further down so it sits below any headings and aligned with controls
  svCanvas.style.top = '150px';
      svCanvas.style.left = '8px';
      svCanvas.style.width = svW + 'px';
      svCanvas.style.height = svH + 'px';
      svCanvas.style.border = '1px solid rgba(0,0,0,0.25)';
      svCanvas.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      svCanvas.style.zIndex = 2000;
      svCanvas.style.pointerEvents = 'none';
      // try to append to the controls column (container -> wrapper div -> grid container -> right column is nextSibling of wrapper)
      svHost = container.parentElement && container.parentElement.nextElementSibling ? container.parentElement.nextElementSibling : container;
      // ensure host is positioned so absolute child aligns within it
      if (svHost && svHost.style) {
        if (!svHost.style.position || svHost.style.position === 'static') svHost.style.position = 'relative';
      }
      svHost.appendChild(svCanvas);
      svCtx = svCanvas.getContext('2d');
      svImage = svCtx.createImageData(svW, svH);
    }

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
  // make the cylinder more transparent so interior visuals (dot/strip) are easier to see
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, opacity: 0.45, transparent: true, side: THREE.DoubleSide, depthWrite: false });
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
    // (removed) radial saturation strip — using plane marker instead when needed
  // Marker on the outer ring: either a small sphere (default) or a small plane/box
  // normalize initial hue (hueRef holds degrees from parent props)
  const initialHueDeg = hueRef.current || 0;
  const initialHue = (initialHueDeg % 360 + 360) % 360 / 360; // normalized 0..1
    const initialBallHeight = ballHeightRef.current || 1; // 0..1
    const initialRadius = radiusRef.current !== undefined ? radiusRef.current : 1;
  const dotAngle = initialHue * 2 * Math.PI;
    const dotRingRadius = initialRadius * ringOuterRadius;
    const initialY = initialBallHeight * heightCyl - heightCyl / 2;

    let dotMesh = null;
    let planeMesh = null;
    if (markerType === 'sphere') {
      const dotRadius = 0.09;
      const dotGeom = new THREE.SphereGeometry(dotRadius, 24, 24);
      const [dotR, dotG, dotB] = hsvToRgb(initialHue, 1, 1);
      const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(dotR, dotG, dotB) });
      dotMesh = new THREE.Mesh(dotGeom, dotMat);
      dotMesh.position.set(
        dotRingRadius * Math.cos(dotAngle),
        initialY,
        dotRingRadius * Math.sin(dotAngle)
      );
      scene.add(dotMesh);
    } else {
      // radial plane marker: a vertical plane that spans the cylinder height and extends from center to the ring
      const planeWidth = ringOuterRadius; // base width (will scale by radius percent in animate)
      const planeHeightFull = heightCyl; // full cylinder height
      const planeGeom = new THREE.PlaneGeometry(planeWidth, planeHeightFull);
      // translate geometry so its left edge sits at the local origin (anchor at cylinder center)
      planeGeom.translate(planeWidth / 2, 0, 0);
      // color the plane per-vertex according to (hue, saturation, value)
      const planePos = planeGeom.attributes.position;
      const planeColorArr = new Float32Array(planePos.count * 3);
      const initialHueForPlane = initialHue;
      for (let i = 0; i < planePos.count; i++) {
        const px = planePos.getX(i); // after translate: 0 .. planeWidth
        const py = planePos.getY(i); // -planeHeightFull/2 .. +planeHeightFull/2
        const s = Math.min(Math.max(px / planeWidth, 0), 1);
        const v = (py + planeHeightFull / 2) / planeHeightFull;
        const [pr, pgc, pbb] = hsvToRgb(initialHueForPlane, s, v);
        planeColorArr[i * 3 + 0] = pr;
        planeColorArr[i * 3 + 1] = pgc;
        planeColorArr[i * 3 + 2] = pbb;
      }
      const planeColorAttr = new THREE.BufferAttribute(planeColorArr, 3);
      planeGeom.setAttribute('color', planeColorAttr);
      // use vertex colors so the plane acts as a 2D color-picker (h chosen by hue slider)
      const planeMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 1.0 });
      planeMesh = new THREE.Mesh(planeGeom, planeMat);
      // anchor the plane's inner edge at the cylinder center (mesh local origin now at inner edge)
      planeMesh.position.set(0, 0, 0);
      // initial rotation aligns with the marker angle
      planeMesh.rotation.y = dotAngle;
      planeMesh.renderOrder = 1000; // draw on top
      // render above the semi-transparent cylinder
      planeMesh.material.depthTest = false;
      scene.add(planeMesh);
    }

    // Guide lines: vertical dashed line through the dot (full height)
    // and a horizontal radial dashed line from center to the dot at the dot's Y
    // older three builds sometimes don't expose geometry.computeLineDistances; to avoid that
    // we generate dashed geometry manually (many short segments) and draw them with LineSegments
  // make guides black for higher contrast
  const guideMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.85, depthTest: false });

    function createDashedGeometry(start, end, dashSize = 0.06, gapSize = 0.04) {
      const dir = new THREE.Vector3().subVectors(end, start);
      const length = dir.length();
      if (length <= 0) {
        // empty geometry
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
        return g;
      }
      dir.normalize();
      const period = dashSize + gapSize;
      const count = Math.floor(length / period);
      const segments = Math.max(1, count);
      // estimate vertices: each segment yields one dashed segment (2 points)
      const positions = [];
      let cursor = 0;
      while (cursor < length) {
        const segStart = cursor;
        const segEnd = Math.min(cursor + dashSize, length);
        const p0 = new THREE.Vector3().addVectors(start, dir.clone().multiplyScalar(segStart));
        const p1 = new THREE.Vector3().addVectors(start, dir.clone().multiplyScalar(segEnd));
        positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
        cursor += period;
      }
      const arr = new Float32Array(positions);
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      return geom;
    }

    // initial simple geometries (will be updated in animate)
    // Only create dashed guides if using the sphere marker. For the plane marker the plane itself is the picker.
    let verticalGeom = null;
    let verticalLine = null;
    let radialGeom = null;
    let radialLine = null;
    let topRadialGeom = null;
    let topRadial = null;
    if (markerType === 'sphere') {
      const vStart = new THREE.Vector3(0, -heightCyl / 2, 0);
      const vEnd = new THREE.Vector3(0, heightCyl / 2, 0);
      verticalGeom = createDashedGeometry(vStart, vEnd);
      verticalLine = new THREE.LineSegments(verticalGeom, guideMat);
      scene.add(verticalLine);

      // initial radial geometry from center to initial marker position
      const initVX = dotRingRadius * Math.cos(dotAngle);
      const initVY = initialY;
      const initVZ = dotRingRadius * Math.sin(dotAngle);
      radialGeom = createDashedGeometry(new THREE.Vector3(0, 0, 0), new THREE.Vector3(initVX, initVY, initVZ));
      radialLine = new THREE.LineSegments(radialGeom, guideMat);
      scene.add(radialLine);

      // Top radial indicator: a dashed radial on the top cap that rotates with the ball
      topRadialGeom = createDashedGeometry(new THREE.Vector3(0, 0, 0), new THREE.Vector3(ringOuterRadius, 0, 0));
      topRadial = new THREE.LineSegments(topRadialGeom, guideMat);
      // place at top cap Y
      topRadial.position.y = heightCyl / 2 + 0.023;
      scene.add(topRadial);
    }

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
      // marker update (sphere or plane)
      const bh = Math.min(Math.max(ballHeightRef.current, 0), 1);
      const yPos = bh * heightCyl - heightCyl / 2;
      // determine radial position from radiusRef (0..1) measured from center to outer ring
      const rr = Math.min(Math.max(radiusRef.current, 0), 1);
      const currentRingRadius = rr * ringOuterRadius;
      const vx = currentRingRadius * Math.cos(h * 2 * Math.PI);
      const vy = yPos;
      const vz = currentRingRadius * Math.sin(h * 2 * Math.PI);

      if (dotMesh && dotMesh.material) {
        // update color for sphere
        dotMesh.material.color.setRGB(r, g, b);
        dotMesh.position.set(vx, vy, vz);
      }
      if (planeMesh) {
        // plane is anchored at the center (local origin). Scale its width to match radius % and rotate it.
        const rrNow = Math.min(Math.max(radiusRef.current, 0), 1);
        planeMesh.scale.set(rrNow, 1, 1); // geometry was built with full ringOuterRadius width
        // rotate so the plane faces the same radial direction as the dotted radius line
        const angle = Math.atan2(vz, vx); // equals h * 2pi
        planeMesh.rotation.y = angle;
        // ensure plane renders above semi-transparent cylinder
        planeMesh.renderOrder = 1000;
        planeMesh.material.depthTest = false;
        // update per-vertex colors on the plane to reflect current hue
        const pg = planeMesh.geometry;
        if (pg && pg.attributes && pg.attributes.position && pg.attributes.color) {
          const ppos = pg.attributes.position;
          const pcol = pg.attributes.color.array;
          const pw = ringOuterRadius; // original plane width used when constructing geometry
          const ph = heightCyl;
          for (let i = 0; i < ppos.count; i++) {
            const px = ppos.getX(i); // 0..pw after translate
            const py = ppos.getY(i);
            const s = Math.min(Math.max(px / pw, 0), 1);
            const vvv = (py + ph / 2) / ph;
            const [pr, pgc, pbb] = hsvToRgb(h, s, vvv);
            pcol[i * 3 + 0] = pr;
            pcol[i * 3 + 1] = pgc;
            pcol[i * 3 + 2] = pbb;
          }
          pg.attributes.color.needsUpdate = true;
        }
      }
      // update guide lines to follow the marker by regenerating dashed geometries
      // use vx, vy, vz computed above
      // update dashed guides only if they exist (sphere mode)
      if (verticalLine && radialLine) {
        // vertical: from bottom to top at current x,z
        const newVStart = new THREE.Vector3(vx, -heightCyl / 2, vz);
        const newVEnd = new THREE.Vector3(vx, heightCyl / 2, vz);
        const newVGeom = createDashedGeometry(newVStart, newVEnd);
        try { verticalLine.geometry.dispose(); } catch (e) {}
        verticalLine.geometry = newVGeom;
        verticalGeom = newVGeom;
        // radial: from center to dot at current Y
        const newRStart = new THREE.Vector3(0, vy, 0);
        const newREnd = new THREE.Vector3(vx, vy, vz);
        const newRGeom = createDashedGeometry(newRStart, newREnd);
        try { radialLine.geometry.dispose(); } catch (e) {}
        radialLine.geometry = newRGeom;
        radialGeom = newRGeom;
      }
        // update top radial: keep it on top and rotate to match ball's angle
        if (topRadial) {
          // set rotation to hue angle (match sphere direction)
          // invert sign if needed so it rotates in the same direction as the sphere
          topRadial.rotation.y = -h * 2 * Math.PI;
          // optionally scale length based on radiusRef so it matches ball direction visually
          const rrTop = Math.min(Math.max(radiusRef.current, 0), 1);
          const topLength = ringOuterRadius * rrTop;
          const newTopGeom = createDashedGeometry(new THREE.Vector3(0, 0, 0), new THREE.Vector3(topLength, 0, 0));
          try { topRadial.geometry.dispose(); } catch (e) {}
          topRadial.geometry = newTopGeom;
          topRadialGeom = newTopGeom;
          // keep top radial black for clarity
          try { topRadial.material.color.setRGB(0, 0, 0); } catch (e) {}
        }
      // update SV preview canvas to reflect current hue
      if (svCtx && svImage) {
        // fill image data: x -> saturation (0..1), y -> value (1..0 top->bottom)
        let idx = 0;
        for (let yy = 0; yy < svH; yy++) {
          const vvv = 1 - yy / (svH - 1); // top = 1, bottom = 0
          for (let xx = 0; xx < svW; xx++) {
            const ss = xx / (svW - 1);
            const [rr, gg, bb] = hsvToRgb(h, ss, vvv);
            svImage.data[idx++] = Math.round(rr * 255);
            svImage.data[idx++] = Math.round(gg * 255);
            svImage.data[idx++] = Math.round(bb * 255);
            svImage.data[idx++] = 255;
          }
        }
        svCtx.putImageData(svImage, 0, 0);
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
      // radial strip removed — no update necessary
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
      // remove and dispose guides (only if created)
      try {
        if (verticalLine) {
          scene.remove(verticalLine);
          try { verticalGeom && verticalGeom.dispose(); } catch (e) {}
        }
        if (radialLine) {
          scene.remove(radialLine);
          try { radialGeom && radialGeom.dispose(); } catch (e) {}
        }
        if (topRadial) {
          scene.remove(topRadial);
          try { topRadial.geometry && topRadial.geometry.dispose(); } catch (e) {}
        }
        try { guideMat.dispose(); } catch (e) {}
      } catch (e) {
        // ignore disposal errors
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      try {
        if (svCanvas) {
          if (svHost && svHost.contains(svCanvas)) svHost.removeChild(svCanvas);
          else if (container.contains(svCanvas)) container.removeChild(svCanvas);
        }
      } catch (e) {}
    };
  }, []);

  // component now renders only the canvas; controls should be placed in the parent
  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
