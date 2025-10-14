import * as THREE from 'three';

// --- SCENE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101020); // Darker background

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 3, 7);

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- FLOOR ---
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// --- GEOMETRIES ---

// Cube on the left
const box = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshPhongMaterial({ color: 0xff4500 }) // Orange-red
);
box.position.set(-2, 0.5, 0);
box.castShadow = true;
scene.add(box);

// Sphere in the middle
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x44ff44,
  wireframe: true,
  metalness: 0.5,
  roughness: 0.3,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); // <-- create the mesh
sphere.position.set(0, 0.7, 0);
sphere.castShadow = true;
scene.add(sphere);

// Cone on the right
const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.7, 1.5, 32),
  new THREE.MeshLambertMaterial({ color: 0xff00ff }) // Magenta
);
cone.position.set(2, 0.75, 0);
cone.castShadow = true;
scene.add(cone);

// --- LIGHTS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffaa00, 0.8);
pointLight.position.set(-5, 5, 2);
scene.add(pointLight);

// --- ANIMATION LOOP ---
function animate() {
  requestAnimationFrame(animate);

  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  sphere.rotation.y += 0.02;

  cone.rotation.x += 0.015;
  cone.rotation.z += 0.015;

  renderer.render(scene, camera);
}
animate();

// --- RESPONSIVE RESIZE ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
