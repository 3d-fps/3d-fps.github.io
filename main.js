import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Setup basic scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create the floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshNormalMaterial()
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Add some boxes to the scene
for (let i = 0; i < 20; i++) {
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    );
    box.position.set(
        Math.random() * 40 - 20,
        0.5,
        Math.random() * 40 - 20
    );
    scene.add(box);
}

// Add player controls
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

// Movement variables
const moveForward = new THREE.Vector3();
const moveRight = new THREE.Vector3();
let isRunning = false;

// Event listeners for movement
const keyState = {};
document.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        isRunning = true;
    }
});
document.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        isRunning = false;
    }
});

// Update function
function animate() {
    requestAnimationFrame(animate);

    const speed = isRunning ? 0.2 : 0.05;
    const velocity = new THREE.Vector3();

    // Check for pressed keys and update velocity
    if (keyState['KeyW']) velocity.z += -speed;
    if (keyState['KeyS']) velocity.z -= -speed;
    if (keyState['KeyA']) velocity.x -= speed;
    if (keyState['KeyD']) velocity.x += speed;

    // Apply movement relative to the camera's direction
    moveForward.setFromMatrixColumn(camera.matrix, 0);
    moveForward.crossVectors(camera.up, moveForward);
    moveRight.setFromMatrixColumn(camera.matrix, 0);

    camera.position.add(moveForward.multiplyScalar(velocity.z));
    camera.position.add(moveRight.multiplyScalar(velocity.x));

    renderer.render(scene, camera);
}

animate();
