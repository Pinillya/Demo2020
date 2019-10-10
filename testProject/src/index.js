// global variables
let renderer;
let scene;
let camera;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let contentManagment;

import * as THREE from 'three';
import { ContentManagment } from './ContentManagment';

function init() {
    //mainjs should contain
    // render and camera
    // Scene management
    // current time
    // Music
    // animationLoop
    
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // position and point the camera to the center of the scene
    camera.position.x = 105;
    camera.position.y = 106;
    camera.position.z = 103;
    camera.lookAt(scene.position);


    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    contentManagment = new ContentManagment(scene, scene, camera);
    contentManagment.addAllScene(scene);

    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);

    // call the animate function
    animate();
}

const getTime = typeof performance === 'function' ? performance.now : Date.now;

const FRAME_DURATION = 1000 / 60;
let lastUpdate = 0;
var timer = 0;
function animate() {
    requestAnimationFrame( animate );
    const now = getTime();
    const delta = (now - lastUpdate) / FRAME_DURATION;

    renderer.render(scene, camera);

    for (var item in contentManagment.scenes) {
        const sceneItem = contentManagment.scenes[item];
        sceneItem.onSceneAnimation(delta);
    }

    //contentManagment.scenes['scene1'].onSceneAnimation(timer);
    timer += 0.1;
    lastUpdate = now;

}


// calls the init function when the window is done loading.
window.onload = init;