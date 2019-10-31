// We need mesh and this.animate as the scene will use the variables.
// onAnimate is the animation loop used if this.animate is true.

import {vertexshader} from '../shaders/driveHome'
import {fragmentshader} from '../shaders/driveHome'
import * as THREE from 'three';

export class shaderTheDriveHome {
    constructor () {

        const objectSizeX = 40;
        const objectSizeY = 40;
        const objectSizeZ = 40;

        const box = false;

        if (box) {
            this.geometry = new THREE.BoxGeometry( objectSizeX, objectSizeY, objectSizeZ );
        } else {
            this.geometry = new THREE.PlaneGeometry( objectSizeX, objectSizeY );
        }

        const height = window.innerHeight;
        const width = window.innerWidth;

        let uniforms = {
            uTime: { type: 'float', value: 0.1 },
            uResolution: { value: new THREE.Vector2(width, height, 1, 1 ) },
            uObjectSize: { value: new THREE.Vector2(objectSizeX, objectSizeY, 1, 1 ) }
        };

        this.material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexshader,
            fragmentShader: fragmentshader
        });

        this.material.side = THREE.DoubleSide;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.animate = true;
        this.variables = {

        };

        this.time = 0;

        if (box) {
            this.mesh.rotation.y += 12.0;
            this.mesh.rotation.x += -0.5;
        }

    }
    onAnimate (delta) {
        this.time += 0.01;

        this.mesh.material.uniforms.uTime.value = this.time;
        this.mesh.material.uniforms.uTime.needsUpdate = true
    }
}
