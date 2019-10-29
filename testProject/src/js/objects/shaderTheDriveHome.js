// We need mesh and this.animate as the scene will use the variables.
// onAnimate is the animation loop used if this.animate is true.

import {vertexshader} from '../shaders/dansingSphereCube'
import {fragmentshader} from '../shaders/dansingSphereCube'


import * as THREE from 'three';
export class shaderTheDriveHome {
    constructor () {

        //this.geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
        //this.geometry = new THREE.SphereGeometry( 30, 70, 70 );
        this.geometry = new THREE.BoxGeometry( 30, 30, 30 );
        //this.geometry = new THREE.PlaneGeometry( 45, 30 );

        let uniforms = {
            uTime: { type: 'float', value: 0.1 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight, 1, 1 ) }
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


        //this.mesh.position.z = -100;
        //this.mesh.position.x = -200;
    }
    onAnimate (delta) {
        this.time += 0.01;
        //this.mesh.rotation.z += delta/100.;
        this.mesh.rotation.y += delta/100.;

        //this.mesh.position.y *= 0.5 + Math.sin(delta) * 10 ;
        //console.log(this.time);

        this.mesh.material.uniforms.uTime.value = this.time;
        this.mesh.material.uniforms.uTime.needsUpdate = true
    }
}
