import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const textureLoader = new THREE.TextureLoader();

const texture1 = textureLoader.load('textures/pexels-anniroenkae-2832432.jpg');
texture1.wrapS = THREE.RepeatWrapping;
texture1.wrapT = THREE.RepeatWrapping;
texture1.repeat.set(4, 4);


const texture2 = textureLoader.load('textures/png-clipart-desktop-display-resolution-geometric-miscellaneous-texture.png');
texture2.wrapS = THREE.RepeatWrapping;
texture2.wrapT = THREE.RepeatWrapping;
texture2.repeat.set(2, 2);


const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
const material2 = new THREE.MeshBasicMaterial({ map: texture2 });


const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material1
);
cube.position.x = -1.5;
scene.add(cube);


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 32, 32),
    material2
);
sphere.position.x = 1.5;
scene.add(sphere);


function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();
