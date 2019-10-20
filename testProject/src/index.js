// global variables
let renderer;
let scene;
let camera;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let exampleDemo;

import * as THREE from 'three';
import { ExampleDemo } from './Demos/ExampleDemo';

function init() {
    //mainjs should contain
    // render and camera
    // Scene management
    // current time
    // Music
    // animationLoop
    
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();




    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);




    exampleDemo = new ExampleDemo(scene);
    //contentManagment.addAllScene(scene);

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

    for (var item in exampleDemo.scenes) {
        const sceneItem = exampleDemo.scenes[item];
        sceneItem.onSceneAnimation(delta);
    }

    renderer.render(scene, exampleDemo.getCamera());

    //contentManagment.scenes['scene1'].onSceneAnimation(timer);
    timer += 0.1;
    lastUpdate = now;

}


// calls the init function when the window is done loading.
window.onload = init;