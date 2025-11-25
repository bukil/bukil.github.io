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
        camera.zoom = frustumSize / (maxDim * 1.6);
        camera.updateProjectionMatrix();
        // scene.add(labRoot); // Moved to contentGroup below
        // Dynamic axis colors: sample mesh material colours at extremes
        function avgColorHex(list) {
            if(!list.length) return '#555555';
            let r=0,g=0,b=0; list.forEach(c=>{ r+=c.r; g+=c.g; b+=c.b; });
            r/=list.length; g/=list.length; b/=list.length;
            const toHex = v => Math.round(Math.max(0,Math.min(1,v))*255).toString(16).padStart(2,'0');
            return '#'+toHex(r)+toHex(g)+toHex(b);
        }

        // Ensure world matrices are up to date for accurate sampling
        labRoot.updateMatrixWorld(true);

        const samples = { xPos:[], xNeg:[], zPos:[], zNeg:[], yPos:[], yNeg:[] };
        const threshX = scaledSize.x * 0.4;
        const threshZ = scaledSize.z * 0.4;
        const threshY = scaledSize.y * 0.4;
        
        const boxWorld = new THREE.Box3().setFromObject(labRoot);
        const centerWorld = new THREE.Vector3(); boxWorld.getCenter(centerWorld);

        labRoot.traverse(obj=>{
          if(obj.isMesh && obj.material && obj.material.color){
            const p = new THREE.Vector3();
            obj.getWorldPosition(p);
            const col = obj.material.color.clone();
            
            const relX = p.x - centerWorld.x;
            const relY = p.y - centerWorld.y;
            const relZ = p.z - centerWorld.z;

            if(relX >  threshX) samples.xPos.push(col);
            if(relX < -threshX) samples.xNeg.push(col);
            if(relZ >  threshZ) samples.zPos.push(col);
            if(relZ < -threshZ) samples.zNeg.push(col);
            if(relY >  threshY) samples.yPos.push(col);
            if(relY < -threshY) samples.yNeg.push(col);
          }
        });

        const colXPos = new THREE.Color(avgColorHex(samples.xPos));
        const colXNeg = new THREE.Color(avgColorHex(samples.xNeg));
        const colZPos = new THREE.Color(avgColorHex(samples.zPos));
        const colZNeg = new THREE.Color(avgColorHex(samples.zNeg));
        const colYPos = new THREE.Color(avgColorHex(samples.yPos));
        const colYNeg = new THREE.Color(avgColorHex(samples.yNeg));

        function getDominantHueName(color) {
            const hsl = {};
            color.getHSL(hsl);
            const h = hsl.h * 360;
            if (h >= 330 || h < 30) return 'red';
            if (h >= 30 && h < 90) return 'yellow';
            if (h >= 90 && h < 150) return 'green';
            if (h >= 150 && h < 210) return 'cyan';
            if (h >= 210 && h < 270) return 'blue';
            if (h >= 270 && h < 330) return 'magenta';
            return 'gray';
        }

        // Build corrected axis arrows (L* now bidirectional: low→high)
        const axisGroup = new THREE.Group();
        const axisLen = Math.max(scaledSize.x, scaledSize.y, scaledSize.z) * 0.55;
        const headLen = axisLen * 0.09;
        const headRadius = headLen * 0.25;
        function addBidirectional(dir, colorPos, colorNeg, labelPos, labelNeg) {
          const nDir = dir.clone().normalize();
          const negEnd = nDir.clone().multiplyScalar(-axisLen);
          const posEnd = nDir.clone().multiplyScalar(axisLen);
          const geom = new THREE.BufferGeometry().setFromPoints([negEnd, posEnd]);
          const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: 0x454545 }));
          axisGroup.add(line);
          const coneGeom = new THREE.ConeGeometry(headRadius, headLen, 20);
          // Positive
          const conePos = new THREE.Mesh(coneGeom, new THREE.MeshBasicMaterial({ color: colorPos }));
          conePos.position.copy(posEnd);
          conePos.lookAt(posEnd.clone().add(nDir));
          axisGroup.add(conePos);
          // Negative
          const coneNeg = new THREE.Mesh(coneGeom.clone(), new THREE.MeshBasicMaterial({ color: colorNeg }));
          coneNeg.position.copy(negEnd);
          coneNeg.lookAt(negEnd.clone().add(nDir.clone().negate()));
          axisGroup.add(coneNeg);
          const posLabel = makeLabelSprite(labelPos, '#111');
          posLabel.position.copy(posEnd.clone().add(nDir.clone().multiplyScalar(headLen*1.6)));
          axisGroup.add(posLabel);
          const negLabel = makeLabelSprite(labelNeg, '#111');
          negLabel.position.copy(negEnd.clone().add(nDir.clone().multiplyScalar(-headLen*1.6)));
          axisGroup.add(negLabel);
        }
        // L* (treat negative as dark / low lightness, positive as high lightness)
        addBidirectional(new THREE.Vector3(0,1,0), colYPos, colYNeg, 'b* Yellow', 'b* Blue');
        
        // Determine X Axis Labels
        const xPosHue = getDominantHueName(colXPos);
        const xNegHue = getDominantHueName(colXNeg);
        let xLabelPos = '+a* (red)', xLabelNeg = '-a* (green)'; // default
        if (xPosHue === 'yellow' || xNegHue === 'blue') { xLabelPos = '+b* (yellow)'; xLabelNeg = '-b* (blue)'; }
        else if (xPosHue === 'blue' || xNegHue === 'yellow') { xLabelPos = '-b* (blue)'; xLabelNeg = '+b* (yellow)'; }
        else if (xPosHue === 'green' || xNegHue === 'red') { xLabelPos = 'L* (High)'; xLabelNeg = '+L* (Low)'; }
        
        addBidirectional(new THREE.Vector3(1,0,0), colXPos, colXNeg, xLabelPos, xLabelNeg);

        // Determine Z Axis Labels
        const zPosHue = getDominantHueName(colZPos);
        const zNegHue = getDominantHueName(colZNeg);
        let zLabelPos = '+b* (yellow)', zLabelNeg = '-b* (blue)'; // default
        if (zPosHue === 'red' || zNegHue === 'green') { zLabelPos = 'a* (Green)'; zLabelNeg = 'a* (Red)'; }
        else if (zPosHue === 'green' || zNegHue === 'red') { zLabelPos = '-a* (green)'; zLabelNeg = '+a* (red)'; }
        else if (zPosHue === 'blue' || zNegHue === 'yellow') { zLabelPos = '-b* (blue)'; zLabelNeg = '+b* (yellow)'; }
        
        addBidirectional(new THREE.Vector3(0,0,1), colZPos, colZNeg, zLabelPos, zLabelNeg);
        
        const contentGroup = new THREE.Group();
        contentGroup.add(labRoot);
        contentGroup.add(axisGroup);
        contentGroup.rotation.y = Math.PI / 4; // Rotate 45 degrees anticlockwise
        scene.add(contentGroup);
        contentGroupRef = contentGroup;

        controls.target.set(0, 0, 0);
        controls.update();
      },
      undefined,
      err => console.error('Failed to load /cielab.glb', err)
    );

    let rafId;
    let contentGroupRef = null;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      if (contentGroupRef) {
        contentGroupRef.rotation.y += 0.002; // Slow rotation
      }
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

  return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
}
