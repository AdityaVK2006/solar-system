import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2;
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 150);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);
pointLight.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1, 
    1.4,  
    0.4  
);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const sunTexture = new THREE.TextureLoader().load('sun.jpg');
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ 
    map: sunTexture,
});

const sun = new THREE.Mesh(geometry, material);
scene.add(sun);


const earthTexture = new THREE.TextureLoader().load('earth.jpg');
const earth = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.8, metalness: 0 }));
earth.position.x = 3;
sun.add(earth);
earth.castShadow = true;
earth.receiveShadow = true;

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.8, metalness: 0 }));
moon.position.x = .8;
earth.add(moon);
moon.castShadow = true;
moon.receiveShadow = true;

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    sun.rotation.y += 0.002;
    earth.rotation.y += 0.002;
    composer.render();
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    composer.setSize(width, height);
});

animate();
