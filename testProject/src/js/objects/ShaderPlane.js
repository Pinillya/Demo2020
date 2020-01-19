// We need mesh and this.animate as the scene will use the variables.
// onAnimate is the animation loop used if this.animate is true.

import * as THREE from 'three';
import { OverTheMoon } from '../shaders/overTheMoonComplete'
import {utilities} from '../shaders/utilities'
import {rainDistortion} from '../shaders/rainDistortion'

import * as background from '../../../assets/textures/background.jpg'


export class ShaderPlane {
    constructor (camera) {
        const overTheMoon = new OverTheMoon();

        const objectSizeX = 60;
        const objectSizeY = 40;

        this.camera = camera;

        console.log(this.camera)

        this.geometry = new THREE.BoxGeometry( objectSizeX, objectSizeY, 20.0);

        const height = window.innerHeight;
        const width = window.innerWidth;

        let uniforms = {
            uCamera : {type: 'vec3', value: this.camera.position},
            uTime: { type: 'float', value: 0.1 },
            uResolution: { value: new THREE.Vector2(width, height, 1, 1 ) },
            uMouse: { type: 'float', value: 0.1 },
            uObjectSize: { value: new THREE.Vector2(objectSizeX, objectSizeY, 1, 1 ) },
            texture1: { value: new THREE.TextureLoader().load( background) }
        };

        let fragShader = utilities.concat(overTheMoon.getFragmentshader());
        //fragShader = fragShader.concat(raindrops.getFragmentshader());

        this.material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: overTheMoon.getVertexshader(),
            fragmentShader: fragShader,
        });

        this.material.side = THREE.DoubleSide;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.animate = true;
        this.variables = {

        };

        this.time = 0;

        this.recordMouse = false;

        const that = this;

        window.addEventListener('mousemove', e => {
           that.onMouseMove(e);
        });
        window.addEventListener('mousedown', e => {
            that.recordMouse = true;
        });
        window.addEventListener('mouseup', e => {
            that.recordMouse = false;
            that.mouseX = 0.0;
        });
        this.mouseX = 0.0;

        this.mesh.position.x += 10;
    }

    onMouseMove( event ) {
        if (this.recordMouse) {
            this.mouseX = event.clientX;
        }
    }

    onAnimate (delta) {
        this.time += 0.01;

        //this.mesh.rotation.y += delta*0.001;
        //this.mesh.position.x += Math.sin(this.time )*0.3;




        //this.camera.position.x = (Math.sin(this.time )*5.0);
        //this.mesh.material.uniforms.uCamera.value = this.camera.position;
        //this.mesh.material.uniforms.uCamera.needsUpdate = true;

        //console.log(this.mouseX);



        if (this.mesh.material.uniforms.uMouse.value != this.mouseX) {
            this.mesh.material.uniforms.uMouse.value = this.mouseX;
            this.mesh.material.uniforms.uMouse.needsUpdate = true;
        }
        //

        this.mesh.material.uniforms.uTime.value = this.time;
        this.mesh.material.uniforms.uTime.needsUpdate = true
    }
}
