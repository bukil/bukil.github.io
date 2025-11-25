import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function CIELABColorSpace3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Orthographic camera similar to Munsell for perceptual consistency
    const aspect = width / height;
    const frustumSize = 6.0;
    const frustumWidth = frustumSize * aspect;
    const camera = new THREE.OrthographicCamera(
      -frustumWidth / 2,
      frustumWidth / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);

    // Lighting setup
    const hemi = new THREE.HemisphereLight(0xffffff, 0xdddddd, 0.85);
    hemi.position.set(0, 6, 0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.55);
    dir.position.set(5, 7, 4);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xffffff, 0.25);
    fill.position.set(-4, 3, -3);
    scene.add(fill);

    const loader = new GLTFLoader();
    let labRoot = null;
    // Utility for creating small text sprites for axis labels
    function makeLabelSprite(text, color = '#111') {
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.font = '48px sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width/2, canvas.height/2);
      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      // scale sprite to readable size
      sprite.scale.set(0.9, 0.45, 1);
      return sprite;
    }
    loader.load(
      '/cielab.glb',
      gltf => {
        labRoot = gltf.scene;
        labRoot.traverse(obj => {
          if (obj.isMesh) {
            obj.castShadow = false;
            obj.receiveShadow = false;
            if (obj.material) {
              obj.material.transparent = true;
              obj.material.opacity = obj.material.opacity ?? 1.0;
            }
          }
        });
        // Center and scale similarly to Munsell approach
        const box = new THREE.Box3().setFromObject(labRoot);
        const size = new THREE.Vector3(); box.getSize(size);
        const center = new THREE.Vector3(); box.getCenter(center);
        labRoot.position.sub(center);
        // Scale to target height
        const targetHeight = 3.2;
        const scale = targetHeight / size.y;
        labRoot.scale.setScalar(scale);
        // Recenter after scaling
        const scaledBox = new THREE.Box3().setFromObject(labRoot);
        const scaledCenter = new THREE.Vector3(); scaledBox.getCenter(scaledCenter);
        labRoot.position.sub(scaledCenter);
        const scaledSize = new THREE.Vector3(); scaledBox.getSize(scaledSize);
        const maxDim = Math.max(scaledSize.x, scaledSize.y, scaledSize.z);
        camera.zoom = frustumSize / (maxDim * 1.05);
        camera.updateProjectionMatrix();
        scene.add(labRoot);
        // Replace axis frame with end-cap arrowheads (no overlapping origins)
        const axisGroup = new THREE.Group();
        const axisLen = Math.max(scaledSize.x, scaledSize.y, scaledSize.z) * 0.55;
        const headLen = axisLen * 0.09;
        const headRadius = headLen * 0.25;
        function addBidirectional(dir, colorPos, colorNeg, labelPos, labelNeg) {
          const nDir = dir.clone().normalize();
          const negEnd = nDir.clone().multiplyScalar(-axisLen);
          const posEnd = nDir.clone().multiplyScalar(axisLen);
          // Axis line
          const geom = new THREE.BufferGeometry().setFromPoints([negEnd, posEnd]);
          const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: 0x444444 }));
          axisGroup.add(line);
          // Arrowheads (cones)
          const coneGeomPos = new THREE.ConeGeometry(headRadius, headLen, 18);
          const coneMatPos = new THREE.MeshBasicMaterial({ color: colorPos });
          const conePos = new THREE.Mesh(coneGeomPos, coneMatPos);
          conePos.position.copy(posEnd);
          conePos.lookAt(posEnd.clone().add(nDir));
          axisGroup.add(conePos);
          const coneGeomNeg = new THREE.ConeGeometry(headRadius, headLen, 18);
          const coneMatNeg = new THREE.MeshBasicMaterial({ color: colorNeg });
          const coneNeg = new THREE.Mesh(coneGeomNeg, coneMatNeg);
          coneNeg.position.copy(negEnd);
          coneNeg.lookAt(negEnd.clone().add(nDir.clone().negate()));
          axisGroup.add(coneNeg);
          // Labels
          const posLabel = makeLabelSprite(labelPos, '#111');
          posLabel.position.copy(posEnd.clone().add(nDir.clone().multiplyScalar(headLen*1.4)));
          axisGroup.add(posLabel);
          const negLabel = makeLabelSprite(labelNeg, '#111');
          negLabel.position.copy(negEnd.clone().add(nDir.clone().multiplyScalar(-headLen*1.4)));
          axisGroup.add(negLabel);
        }
        // L* axis (single direction upward 0→100)
        const lLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0,0,0), new THREE.Vector3(0,axisLen,0)
        ]), new THREE.LineBasicMaterial({ color: 0x555555 }));
        axisGroup.add(lLine);
        const lConeGeom = new THREE.ConeGeometry(headRadius, headLen, 18);
        const lCone = new THREE.Mesh(lConeGeom, new THREE.MeshBasicMaterial({ color: 0x222222 }));
        lCone.position.set(0, axisLen, 0);
        lCone.lookAt(0, axisLen + 1, 0);
        axisGroup.add(lCone);
        const lLabel = makeLabelSprite('L*', '#111');
        lLabel.position.set(0, axisLen + headLen*1.6, 0);
        axisGroup.add(lLabel);
        // a* axis (negative green, positive red)
        addBidirectional(new THREE.Vector3(1,0,0), 0xff2222, 0x118822, '+a* (red)', '-a* (green)');
        // b* axis (negative blue, positive yellow)
        addBidirectional(new THREE.Vector3(0,0,1), 0xffd200, 0x2060ff, '+b* (yellow)', '-b* (blue)');
        scene.add(axisGroup);
        controls.target.set(0, 0, 0);
        controls.update();
      },
      undefined,
      err => console.error('Failed to load /cielab.glb', err)
    );

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      // Removed automatic self-rotation per request
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
}
