import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- SCENE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa7c7e7);

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(40, 30, 40);
camera.lookAt(0, 0, 0);

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- CONTROLS ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- LIGHTS ---
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(30, 40, 20);
dirLight.castShadow = true;
scene.add(dirLight);

// --- TEXTURE LOADER ---
const textureLoader = new THREE.TextureLoader();

// --- TEXTURES ---
const grassTexture = textureLoader.load('textures/istockphoto-1158274915-612x612.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

const roadTexture = textureLoader.load('textures/0111-asphalt-road-texture-seamless-hr.jpg');
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(4, 4);

const brickTexture = textureLoader.load('textures/133-pin.jpg');
const concreteTexture = textureLoader.load('textures/189-concrete-bare-pbr-texture-seamless.jpg');

// --- MATERIALS ---
const grassMat = new THREE.MeshStandardMaterial({ map: grassTexture });
const roadMat = new THREE.MeshStandardMaterial({ map: roadTexture });
const blueMat = new THREE.MeshStandardMaterial({ map: brickTexture });
const blackMat = new THREE.MeshStandardMaterial({ map: concreteTexture });
const orangeMat = new THREE.MeshStandardMaterial({ map: brickTexture });
const whiteMat = new THREE.MeshStandardMaterial({
  color: 0x99ccff,
  transparent: true,
  opacity: 0.4
});
const greenMat = new THREE.MeshStandardMaterial({ color: 0x20B2AA });

// --- GRASS ---
const grass = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), grassMat);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);

// === ROUNDABOUT ===
const innerCircle = new THREE.Mesh(
  new THREE.CylinderGeometry(2, 1, 0.5, 64),
  greenMat
);
innerCircle.position.set(0, 0.2, 0);
scene.add(innerCircle);

const outerRing = new THREE.Mesh(
  new THREE.RingGeometry(0, 3, 64),
  new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);
outerRing.rotation.x = -Math.PI / 2;
outerRing.position.set(0, 0.26, 0);
scene.add(outerRing);

// --- ROADS ---
function createRoad(x, z, w, h, rot = 0) {
  const road = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, h), roadMat);
  road.position.set(x, 0.05, z);
  road.rotation.y = rot;
  road.receiveShadow = true;
  scene.add(road);
}

createRoad(0, 0, 8, 60);
createRoad(0, 0, 40, 8);
createRoad(7, -19, 40, 8);

// --- BUILDINGS ---
function createBuilding(x, z, w, h, d, mat) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  b.position.set(x, h / 2, z);
  b.castShadow = true;
  scene.add(b);
  return b;
}

const b1 = createBuilding(-22, 10, 22, 5, 6, blueMat);
const b2 = createBuilding(10, 22, 10, 8, 11, orangeMat);
const b3 = createBuilding(15, -9, 6, 5, 10, whiteMat); // transparent glass
const b4 = createBuilding(10, -30, 6, 8, 10, blueMat);
const b5 = createBuilding(-20, -10, 10, 5, 10, blackMat);

// --- GLTF TREE ---
const gltfLoader = new GLTFLoader();
gltfLoader.load('models/tree.glb', (gltf) => {
  const tree = gltf.scene;
  tree.scale.set(3, 3, 3);
  tree.position.set(-10, 0, -20);
  tree.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });
  scene.add(tree);
});

// --- CLICK COLORS ---
const clickColors = [
  0xffffff, // white
  0x2196f3, // blue
  0x9ad0ec, // baby blue
  0x000000  // black
];

// --- INTERACTION (CLICK) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const obj = intersects[0].object;

    if (!obj.material || !obj.material.color) return;

    if (obj.userData.colorIndex === undefined) obj.userData.colorIndex = 0;

    obj.material.color.setHex(clickColors[obj.userData.colorIndex]);
    obj.userData.colorIndex =
      (obj.userData.colorIndex + 1) % clickColors.length;
  }
});

// --- ANIMATION ---
function animate() {
  requestAnimationFrame(animate);

  innerCircle.rotation.y += 0.01; // rotating inner roundabout

  controls.update();
  renderer.render(scene, camera);
}
animate();

// --- RESIZE ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
