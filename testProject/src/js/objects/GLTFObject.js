import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as cubeFile from '../../../assets/export/exportTesting/cube.glb'
import * as mocapFile from '../../../assets/export/exportTesting/mocapDancing.glb'


export class GLTFObject {
    constructor () {

        let that = this;

        let loader = new GLTFLoader().setPath('../../../assets/export/exportTesting/');
        
        loader.load( 'mocapDancing.glb', function ( gltf ) {
            console.log("About to traverse scene");


            gltf.scene.traverse( function ( child ) {

                if(child.name == "Camera") {
                    console.log("Woot, found a camera!");
                    that.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                    that.camera.position.x = child.position.x;
                    that.camera.position.y = child.position.y;
                    that.camera.position.z = child.position.z;
                    that.camera.quaternion.w = child.quaternion.w;
                    that.camera.quaternion.x = child.quaternion.x;
                    that.camera.quaternion.y = child.quaternion.y;
                    that.camera.quaternion.z = child.quaternion.z;

                    that.camera.up.y = child.up.y;
                } else if(child.isMesh) {
                    console.log("Found a mesh!")
                }
                
            } );
            console.log("finished traversing scene");
            that.mesh = gltf.scene;

        } );


        this.animate = true;
    }

    generateMesh(){

    }

    onAnimate (step) {
    }
}
