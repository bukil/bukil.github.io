import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function MunsellColorSpace3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Orthographic camera replacing previous perspective view
    const aspect = width / height;
    const frustumHeight = 6.0; // base vertical span before zoom fitting
    const frustumWidth = frustumHeight * aspect;
    const camera = new THREE.OrthographicCamera(
      -frustumWidth / 2,
      frustumWidth / 2,
      frustumHeight / 2,
      -frustumHeight / 2,
      0.1,
      100
    );
    // Position diagonally so orthographic still shows 3D structure
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false; // disable wheel/pinch zoom
    controls.enablePan = false;  // keep rotation only
    controls.target.set(0, 0, 0);

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0xdddddd, 0.85);
    hemi.position.set(0, 6, 0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.55);
    dir.position.set(5, 7, 4);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xffffff, 0.25);
    fill.position.set(-4, 3, -3);
    scene.add(fill);

    // (Removed ground shadow for cleaner view)

    // Load GLB model
    const loader = new GLTFLoader();
    let munsellRoot = null;
    loader.load(
      '/munsel.glb',
      gltf => {
        munsellRoot = gltf.scene;
        munsellRoot.traverse(obj => {
          if (obj.isMesh) {
            obj.castShadow = false;
            obj.receiveShadow = false;
            if (obj.material) {
              obj.material.transparent = true;
              obj.material.opacity = obj.material.opacity ?? 1.0;
            }
          }
        });
        // Center original, scale, then refit orthographic frustum via zoom
        const box = new THREE.Box3().setFromObject(munsellRoot);
        const size = new THREE.Vector3(); box.getSize(size);
        const center = new THREE.Vector3(); box.getCenter(center);
        // Initial recentre using original bounds
        munsellRoot.position.sub(center);
        const targetHeight = 3.0;
        const scale = targetHeight / size.y;
        munsellRoot.scale.setScalar(scale);
        // Recompute after scaling and recenter again to ensure true pivot at origin
        const scaledBox = new THREE.Box3().setFromObject(munsellRoot);
        const scaledCenter = new THREE.Vector3(); scaledBox.getCenter(scaledCenter);
        munsellRoot.position.sub(scaledCenter);
        const scaledSize = new THREE.Vector3(); scaledBox.getSize(scaledSize);
        const maxDim = Math.max(scaledSize.x, scaledSize.y, scaledSize.z);
        // Adjust zoom so model fits comfortably within frustum (slightly tight)
        camera.zoom = frustumHeight / (maxDim * 1.05);
        camera.updateProjectionMatrix();
        scene.add(munsellRoot);
        controls.target.set(0, 0, 0);
        controls.update();
      },
      undefined,
      err => console.error('Failed to load /munsel.glb', err)
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

  return <div ref={mountRef} style={{ width: '100%', height: '420px' }} />;
}
