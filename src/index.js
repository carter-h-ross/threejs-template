/*-------------------------------------- three js section ---------------------------------------*/

// threejs imports
import * as THREE from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const gltfLoader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

// starting camera position
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 20;
camera.position.y = 30;
camera.position.x = 20;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

//board pieces placed ** currently for development only cubes **
var meshes = [];
const pieceModels = {
  'wp': 'pieces/white-pawn.gltf',
  'wk': 'pieces/white-king.gltf',
  'wq': 'pieces/white-queen.gltf',
  'wr': 'pieces/white-rook.gltf',
  'wb': 'pieces/white-bishop.gltf',
  'wn': 'pieces/white-knight.gltf',
  'bp': 'pieces/black-pawn.gltf',
  'bk': 'pieces/black-king.gltf',
  'bq': 'pieces/black-queen.gltf',
  'br': 'pieces/black-rook.gltf',
  'bb': 'pieces/black-bishop.gltf',
  'bn': 'pieces/black-knight.gltf',
};

// board location planes for raycast and game logic
var prevClickedMesh = null;

/*
function onCanvasClick(event) {
  const canvasBounds = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2();
  mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
  mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true); // Set the second parameter to true to check all descendants of an object

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    let targetObject = clickedMesh;
    while (!targetObject.userData.index && targetObject.parent) {
      targetObject = targetObject.parent;
    }      
  }
}
*/

// ambient scene light
/*
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight);
*/

function rgbToHex(r, g, b) {
  var redHex = r.toString(16).padStart(2, '0');
  var greenHex = g.toString(16).padStart(2, '0');
  var blueHex = b.toString(16).padStart(2, '0');
  return parseInt(redHex + greenHex + blueHex, 16);
}

// background
let backgrounds = {
  "space clouds": "space_clouds.jpg", 
  "mountain": "mountain.jpg",
  "falling lights": "falling_lights.jpg",
  "white": "white_background.jpeg",
  "night sky": "night_sky.jpg",
  "nebula": "nebula.jpg",
  "future_abstract": "future_abstract.jpg",
  "green blue nebula": "green_blue_nebula.jpg",
  "gold_abstract": "gold_abstract.jpg",
  "colors": "colors.jpg",
}
let keys = Object.keys(backgrounds);
let currentBackgroundIndex = 9;

/* Set the initial background
let background_texture = new THREE.TextureLoader().load(backgrounds[keys[currentBackgroundIndex]]);
scene.background = background_texture;
*/

// Listen to keydown event
window.addEventListener('keydown', function(event) {
  switch (event.key) {
    case 'ArrowUp':
      currentBackgroundIndex++;
      if (currentBackgroundIndex >= keys.length) {
        currentBackgroundIndex = 0;
      }
      break;
    case 'ArrowDown':
      currentBackgroundIndex--;
      if (currentBackgroundIndex < 0) {
        currentBackgroundIndex = keys.length - 1;
      }
      break;
  }
  let newBackgroundTexture = new THREE.TextureLoader().load(backgrounds[keys[currentBackgroundIndex]]);
  scene.background = newBackgroundTexture;
});

// directional light
var pointLights = [];
function addPointLight(color, intensity, distance, position) {
  const pointLight = new THREE.PointLight(color, intensity, distance);
  pointLight.position.set(position.x, position.y, position.z);
  pointLights.push(pointLight);
  scene.add(pointLight);
}
function clearPointLights() {
  for (var light of pointLights) {
    scene.remove(light);
  }
  pointLights = [];
}

// main loop
let spin = false;
let angle = 0;
let radius = 40;
function stopSpin() {
  spin = false;
}
function startSpin() {
  spin = true;
  camera.position.x = 0;
  camera.position.z = 0;
  camera.position.y = 7;
}
startSpin();
function animate() {
  
  if (spin) {

    angle += 0.003;
    camera.lookAt(new THREE.Vector3(radius * Math.sin(angle), 10, radius * Math.cos(angle)));

  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);