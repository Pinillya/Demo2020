// We need mesh and this.animate as the scene will use the variables.
// onAnimate is the animation loop used if this.animate is true.

import {vertexshader} from './shaderGeometryShaders'
import {fragmentshader} from './shaderGeometryShaders'


import * as THREE from 'three';
export class shadedGeometry {
    constructor () {

        //this.geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
        //this.geometry = new THREE.SphereGeometry( 30, 70, 70 );
        this.geometry = new THREE.BoxGeometry( 70, 70, 70 );

        let uniforms = {
            colorB: {type: 'vec3', value: new THREE.Color(0xff0000)},
            colorA: {type: 'vec3', value: new THREE.Color(0xff0000)},
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
            colorA: 0x552222,
            colorB: 0x00f010
        };

        //this.mesh.position.z = -100;
        //this.mesh.position.x = -200;
    }
    onAnimate (delta) {
        this.mesh.rotation.z += delta/100.;
        this.mesh.rotation.y += delta/100.;

        this.mesh.material.uniforms.colorA.value = new THREE.Color(Number(this.variables.colorA));
        this.mesh.material.uniforms.colorA.needsUpdate = true

        this.mesh.material.uniforms.colorB.value = new THREE.Color(Number(this.variables.colorB));
        this.mesh.material.uniforms.colorB.needsUpdate = true

        this.mesh.material.uniforms.uTime.value = delta/1.0;
        this.mesh.material.uniforms.uTime.needsUpdate = true
    }
}
