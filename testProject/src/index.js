import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as cube from '../assets/export/exportTesting/mocapDancing.glb';
import { codeExampleCube } from './js/codeExampleCube'

// global variables
let renderer;
let scene;
let camera;


let scenes = {};



class Scene1 {
    // contains all the objects of that scene.
    // onDestyroy
    // onInit
    // onAnimate
    // timeline

    constructor () {
        this.sceneObjects = [];
        this.onInit();
        this.name = 'Scene1';
    }

    onInit () {
        var basicCube = new codeExampleCube;
        this.sceneObjects.push(basicCube);
        scene.add(basicCube.mesh);
    }


    onSceneAnimation() {
        if (this.sceneObjects && this.sceneObjects.legnth > 0) {
            this.sceneObjects.children.forEach( function(child) {
                if (child.animate) {
                    child.onAnimate(timer);
                }
            })
        }
    }

    onActivated() {
        console.log('activate');
    }

    onDestroy() {
        console.log('destroy')
    }
}


class ContentManagment {
    constructor () {
        this.getMouseEvents();
        this.onInit()
    }

    onInit () {

    }


    addScene (scene) {
        scenes = {
            scene1: new Scene1,
            scene2: new Scene1
        };

        this.setupSceneButtons();
    }

    setupSceneButtons () {
        const parentObject = document.getElementById('list-items');

        for(var item in scenes){
            const scene = scenes[item];
            var btn = document.createElement("BUTTON");   // Create a <button> element
            btn.className = "button list";
            btn.id = item;
            btn.innerHTML = scene.name + "<div class=\"line\"></div> </button> ";
            btn.addEventListener("mouseup", this.sceneButtonPressed);
            parentObject.appendChild(btn);
        }
    }

    sceneButtonPressed (event) {
        onSceneChange(scenes[event.srcElement.id]);
        scenes[event.srcElement.id].onActivated();
    }

    getMouseEvents () {
        const that = this;
        let buttons = document.getElementsByClassName("button");
        Array.prototype.forEach.call(buttons, function(button) {
            button.addEventListener("mouseup", that.mouseUp);
        });
    }

    mouseUp (event) {
        if (event.srcElement.id === 'scene' && contentManagment) {
            contentManagment.sceneToggle();
        }
    }

    sceneToggle () {
        console.log('toggle');
    }
}
let contentManagment = new ContentManagment();

let selectedScene;
let prevSelectedScene;
function onSceneChange(scene) {
    if (selectedScene) {
        prevSelectedScene = selectedScene;
        prevSelectedScene.onDestroy();
    }
    selectedScene = scene;
}

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


    contentManagment.addScene();

    const loader = new GLTFLoader();
    loader.load( cube, function ( gltf ) {

        gltf.scene.traverse( function ( child ) {
            //console.log(child);
            if ( child.isMesh ) {
                //console.log(child);
                //child.material.envMap = envMap;
            } else {
                //console.log(child);
                //camera = child;
            }
        } );
        //console.log(gltf.scene);
        scene.add( gltf.scene );
    } );

    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);

    // call the animate function
    animate();
}

var timer = 0;
function animate() {
    requestAnimationFrame( animate );

    renderer.render(scene, camera);

    scenes['scene1'].onSceneAnimation();
    timer += 0.1;
}


// calls the init function when the window is done loading.
window.onload = init;