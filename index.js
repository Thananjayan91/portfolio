// import {OrbitControls} from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'
// import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
// const canvas = document.querySelector('canvas.webgl')

// // Scene
// const scene = new THREE.Scene()

// const textureLoader = new THREE.TextureLoader()
// const myTexture = textureLoader().load('coolTex.jpg')

// // Object
// const geometry1 = new THREE.BoxGeometry(1,1,1)
// const geometry2 = new THREE.DodecahedronGeometry(0.5,3)
// const material1 = new THREE.MeshBasicMaterial({
//     map: myTexture
// })
// const boxMesh = new THREE.Mesh(geometry1,material1)
// const sphereMesh = new THREE.Mesh(geometry2,material1)
// scene.add(boxMesh)
// // scene.add(sphereMesh)
// boxMesh.position.x = 0
// boxMesh.position.y = 0.8
// sphereMesh.position.x = -1.6
// sphereMesh.position.y = 0.5
// geometry.center()
// // Sizes
// const sizes = {
//     width:window.innerWidth,
//     height:window.innerHeight
// }

// // Renderer gets updated each time window is resized
// window.addEventListener('resize',()=>{
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     camera.aspect = sizes.width/sizes.height
//     camera.updateProjectionMatrix()

//     renderer.setSize(sizes.width,sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    
// })

// // Camera
// const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1,100)
// camera.position.z = 3
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)

// controls.enableZoom = false;
// controls.enableDamping = true

// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     alpha: true,
// })
// renderer.setSize(sizes.width,sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

// const clock = new THREE.Clock()

// const tick = () => {
//     const elapsedTime = clock.getElapsedTime()
//     boxMesh.rotateX(30*0.0003)
//     boxMesh.rotateY(30*0.0003)
//     sphereMesh.rotateY(30*0.0003)
//     // mesh.position.y = Math.sin(elapsedTime) *0.1
//     boxMesh.position.z = Math.sin(elapsedTime) * 1

//     controls.update()
//     controls.enableDamping = true
//     renderer.render(scene,camera)
//     window.requestAnimationFrame(tick)
// };

// tick()



// import './style.css';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, withd / hait, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(withd, hait);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 8, 10);
const material = new THREE.MeshStandardMaterial({ color: 0xffff00, wireframe:true });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(400).fill().forEach(addStar);

// Background

// const spaceTexture = new THREE.TextureLoader().load('space.jpg');
// scene.background = spaceTexture;

// Avatar

const jeffTexture = new THREE.TextureLoader().load('Thananjayan.jpg');

const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ 
    map: jeffTexture }));

scene.add(jeff);

// Moon

// const moonTexture = new THREE.TextureLoader().load('moon.jpg');
// const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 15, 5),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    trasparent: true,
    wireframe: true
    // map: moonTexture,
    // normalMap: normalTexture,
  })
);

const moon2 = new THREE.Mesh(
    new THREE.SphereGeometry(3, 15, 5),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      trasparent: true,
      wireframe: true
      // map: moonTexture,
      // normalMap: normalTexture,
    })
  );


  const moon3 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 10, 5),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
      trasparent: true,
      wireframe: true
      // map: moonTexture,
      // normalMap: normalTexture,
    })
  );


  const moon4 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 10, 5),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
      trasparent: true,
      wireframe: true
      // map: moonTexture,
      // normalMap: normalTexture,
    })
  );
scene.add(moon);
scene.add(moon2);
scene.add(moon3);
scene.add(moon4);



moon.position.z = 30;
moon.position.setX(-10);
moon4.position.z = 30;
moon4.position.setX(-10);

moon2.position.z = 10;
moon2.position.setX(-10);

moon3.position.z = 10;
moon3.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  moon2.rotation.x += 0.05;
  moon2.rotation.y += 0.075;
  moon2.rotation.z += 0.05;

  moon4.rotation.x += 0.05;
  moon4.rotation.y += 0.075;
  moon4.rotation.z += 0.05;


  moon3.rotation.x += 0.05;
  moon3.rotation.y += 0.075;
  moon3.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  jeff.rotation.y += 0.01;

  // controls.update();

  renderer.render(scene, camera);
}

animate();