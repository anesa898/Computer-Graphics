import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- SCENE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa7c7e7);

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
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
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(30, 40, 20);
dirLight.castShadow = true;
scene.add(dirLight);

// --- MATERIALS ---
const grassMat = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
const roadMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
const blueMat = new THREE.MeshPhongMaterial({ color: 0x2196f3 });
const blackMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
const orangeMat = new THREE.MeshPhongMaterial({ color: 0xff9800 });
const whiteMat = new THREE.MeshPhongMaterial({ color: 0xffffff});
const greenMat = new THREE.MeshPhongMaterial({ color: 0x20B2AA});

// --- GRASS ---
const grass = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), grassMat);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);
// === KRUŽNI TOK ===

// Unutrašnji deo (centar) - narandžasti i statičan
const innerCircleGeometry = new THREE.CylinderGeometry(2, 1, 0.5, 64);
const innerCircleMaterial = new THREE.MeshStandardMaterial({ color:0x4caf50 });
const innerCircle = new THREE.Mesh(innerCircleGeometry, innerCircleMaterial);
innerCircle.position.set(0, 0.20, 0);
scene.add(innerCircle);

// Spoljašnji deo (put) - prsten u sivoj boji
const outerRingGeometry = new THREE.RingGeometry(0, 3, 64);
const outerRingMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xffffff, 
  side: THREE.DoubleSide 
});
const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
outerRing.rotation.x = -Math.PI / 2;
outerRing.position.set(0, 0.26, 0);
scene.add(outerRing);


// --- ROADS (white) ---
function createRoad(x, z, w, h, rot = 0) {
  const road = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, h), roadMat);
  road.position.set(x, 0.05, z);
  road.rotation.y = rot;
  scene.add(road);
}


// Cross roads
createRoad(0, 0, 8, 60); // vertical
createRoad(0, 0, 40, 8); // horizontal
createRoad(7, -19, 40, 8);

// --- BUILDINGS ---
function createBuilding(x, z, w, h, d, mat, rot = 0) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  b.position.set(x, h / 2, z);
  b.rotation.y = rot;
  b.castShadow = true;
  scene.add(b);
}

//  Top-left (horizontal, more left, longer)
createBuilding(-22, 10,22 , 5, 6, blueMat);

//  Top-right (bigger, moved closer to X-axis)
createBuilding(10, 22, 10, 8, 11, orangeMat);

//  New blue building (moved to other side, between black and blue down right)
createBuilding(15, -9, 6, 5, 10,  whiteMat);

createBuilding(10, -30, 6, 8, 10,  blueMat);

//  Bottom-eft (upright, now bigger)
createBuilding(-20, -10, 10, 5, 10,  blackMat);



// --- ANIMATION ---
function animate() {
  requestAnimationFrame(animate);
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
