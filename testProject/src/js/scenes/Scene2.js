import { codeExampleCube } from '../objects/codeExampleCube'
import { MyParticleSystem } from '../objects/MyParticleSystem'
import { BasicScene } from "./BasicScene";
import * as THREE from 'three';


export class Scene2 extends BasicScene {
    onActivated () {
        let basicCube = new codeExampleCube;
        this.addObject(basicCube);

        let partSystem = new MyParticleSystem(10, 10);
        this.addObject(partSystem);
    }

    setupBasicCamera () {
        //if (this.camera.length == 0) {
        //this.camera = new THREE.OrthographicCamera(window.innerWidth / - 2 ) //,  / window.innerHeight, 0.1, 1000);
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

        // position and point the camera to the center of the scene
        this.camera.position.x = 15;
        this.camera.position.y = 16;
        this.camera.position.z = 103;
        //this.camera.lookAt(this.scene.position);
        //}
    }
}