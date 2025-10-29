import * as THREE from 'three';

export function addRGBLabels(scene) {
  // Helper to create a text sprite
  function makeTextSprite(message, color) {
    const fontSize = 80;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.font = `bold ${fontSize}px 'NewYork Web', Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.6, 0.38, 1);
    return sprite;
  }

  // Red label (X axis)
  const redLabel = makeTextSprite('Red', '#f00');
  redLabel.position.set(1.3, 0, 0);
  scene.add(redLabel);

  // Green label (Y axis)
  const greenLabel = makeTextSprite('Green', '#0a0');
  greenLabel.position.set(0, 1.3, 0);
  scene.add(greenLabel);

  // Blue label (Z axis)
  const blueLabel = makeTextSprite('Blue', '#00f');
  blueLabel.position.set(0, 0, 1.3);
  scene.add(blueLabel);
}
