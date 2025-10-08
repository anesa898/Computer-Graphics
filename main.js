// Import the library
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Geometry options
const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
// const geometry = new THREE.ConeGeometry(1, 2, 32);
// const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
// const geometry = new THREE.SphereGeometry(1, 32, 32);

//const material=new THREE.MeshBasicMaterial({color:0xffb6c1});
//const material = new THREE.MeshLambertMaterial({ color: 0x8844ff });
/*const material=new THREE.MeshStandardMaterial({
color:0x800000,
metalness:0.4,
roughness:0.3,
emissive:0x220044,
});*/
const material = new THREE.MeshPhongMaterial({
    color:0x8844ff,
    specular:0xffffff,
    shininness:50
});

const object = new THREE.Mesh(geometry, material);
scene.add(object);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight,0.5);
scene.add(lightHelper);

ambientLight.intensity=0.4;
directionalLight.intensity=1.2;


camera.position.z = 5;


function animate() {
requestAnimationFrame(animate);
object.rotation.x += 0.01;
object.rotation.y += 0.01;
renderer.render(scene, camera);
}

animate();