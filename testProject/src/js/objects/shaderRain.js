// We need mesh and this.animate as the scene will use the variables.
// onAnimate is the animation loop used if this.animate is true.

import * as THREE from 'three';
import {Raindrops} from '../shaders/raindrops'
import * as background from '../../../assets/textures/background.jpg'


export class shaderRain {
    constructor () {
        const raindrops = new Raindrops();

        const objectSizeX = 40;
        const objectSizeY = 40;

        this.geometry = new THREE.PlaneGeometry( objectSizeX, objectSizeY);

        const height = window.innerHeight;
        const width = window.innerWidth;

        let uniforms = {
            uTime: { type: 'float', value: 0.1 },
            uResolution: { value: new THREE.Vector2(width, height, 1, 1 ) },
            uMouse: { type: 'float', value: 0.1 },
            uObjectSize: { value: new THREE.Vector2(objectSizeX, objectSizeY, 1, 1 ) },
            texture1: { value: new THREE.TextureLoader().load( background) }
        };

        this.material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: raindrops.getVertexshader(),
            fragmentShader: raindrops.getFragmentshader(),
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
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
    }

    onMouseMove( event ) {
        if (this.recordMouse) {
            this.mouseX = event.clientX;
        }
    }

    onAnimate (delta) {
        this.time += 0.01;

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
