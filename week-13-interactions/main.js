// =============================
// IMPORTS
// =============================
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// =============================
// UI PANEL
// =============================
const infoPanel = document.createElement("div");
Object.assign(infoPanel.style, {
  position: "absolute",
  top: "10px",
  left: "10px",
  width: "280px",
  padding: "12px",
  background: "rgba(0,0,0,0.85)",
  color: "white",
  fontFamily: "Arial, sans-serif",
  borderRadius: "8px",
  zIndex: 10
});
infoPanel.innerText = "Click a cube to see its information here.";
document.body.appendChild(infoPanel);

// =============================
// SCENE
// =============================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e1e);

// =============================
// CAMERA
// =============================
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(25, 20, 30);
camera.lookAt(0, 0, 0);

// =============================
// RENDERER
// =============================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// =============================
// CONTROLS
// =============================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// =============================
// LIGHTING
// =============================
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// =============================
// FLOOR
// =============================
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(70, 70),
  new THREE.MeshStandardMaterial({
    color: 0x444444,
    side: THREE.DoubleSide
  })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -5;
scene.add(floor);

// =============================
// HELPER: DISTANCE CHECK
// =============================
function isPositionValid(pos, existing, minDistance) {
  return existing.every(cube =>
    cube.position.distanceTo(pos) > minDistance
  );
}

// =============================
// CUBES (NO TOUCHING)
// =============================
const cubes = [];
const MIN_DISTANCE = 4;

for (let i = 0; i < 20; i++) {
  const w = Math.random() * 2 + 1;
  const h = Math.random() * 2 + 1;
  const d = Math.random() * 2 + 1;

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff
    })
  );

  // Find valid position
  let positionFound = false;
  let attempts = 0;

  while (!positionFound && attempts < 100) {
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * 30,
      Math.random() * 8,
      (Math.random() - 0.5) * 30
    );

    if (isPositionValid(pos, cubes, MIN_DISTANCE)) {
      cube.position.copy(pos);
      positionFound = true;
    }
    attempts++;
  }

  cube.userData = {
    width: w,
    height: h,
    depth: d,
    baseY: cube.position.y,
    phase: Math.random() * Math.PI * 2,
    targetScale: 1,
    originalColor: cube.material.color.clone(),

    // RANDOM BEHAVIOR
    rotate: Math.random() > 0.5,
    rotateSpeed: Math.random() * 0.01 + 0.005
  };

  cubes.push(cube);
  scene.add(cube);
}

// =============================
// RAYCASTING
// =============================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedCube = null;

// =============================
// CLICK HANDLER
// =============================
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(cubes);

  if (selectedCube) {
    selectedCube.material.color.copy(
      selectedCube.userData.originalColor
    );
    selectedCube.userData.targetScale = 1;
  }

  if (hits.length > 0) {
    selectedCube = hits[0].object;
    selectedCube.material.color.set(0xffcc00);
    selectedCube.userData.targetScale = 1.3;

    const p = selectedCube.position;
    const s = selectedCube.userData;

    infoPanel.innerHTML = `
      <strong>Cube Selected</strong><br><br>
      <strong>Position</strong><br>
      x: ${p.x.toFixed(2)}<br>
      y: ${p.y.toFixed(2)}<br>
      z: ${p.z.toFixed(2)}<br><br>
      <strong>Size</strong><br>
      width: ${s.width.toFixed(2)}<br>
      height: ${s.height.toFixed(2)}<br>
      depth: ${s.depth.toFixed(2)}
    `;
  } else {
    selectedCube = null;
    infoPanel.innerText = "No object selected.";
  }
});

// =============================
// RESIZE
// =============================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =============================
// ANIMATION LOOP
// =============================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  cubes.forEach(cube => {
    // Floating
    cube.position.y =
      cube.userData.baseY +
      Math.sin(time + cube.userData.phase) * 0.5;

    // Rotation (only some cubes)
    if (cube.userData.rotate) {
      cube.rotation.y += cube.userData.rotateSpeed;
      cube.rotation.x += cube.userData.rotateSpeed * 0.5;
    }

    // Smooth scale
    const s = THREE.MathUtils.lerp(
      cube.scale.x,
      cube.userData.targetScale,
      0.1
    );
    cube.scale.set(s, s, s);
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
