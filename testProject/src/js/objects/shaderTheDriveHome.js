// We need mesh and this.animate as the scene will use the variables.
// onAnimate is the animation loop used if this.animate is true.

import {vertexshader} from '../shaders/driveHome'
import {fragmentshader} from '../shaders/driveHome'


import * as THREE from 'three';
export class shaderTheDriveHome {
    constructor () {
        const objectSizeX = 60;
        const objectSizeY = 30;
        const objectSizeZ = 30;

        //this.geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
        //this.geometry = new THREE.SphereGeometry( objectSizeX, objectSizeY, 30 );
        //this.geometry = new THREE.BoxGeometry( objectSizeX, objectSizeY, objectSizeZ );
        this.geometry = new THREE.PlaneGeometry( objectSizeX, objectSizeY );

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


        //this.mesh.position.z = -100;
        //this.mesh.position.x = -20;
    }
    onAnimate (delta) {
        this.time += 0.01;
        //this.mesh.rotation.z += delta/100.;
        //this.mesh.rotation.y += delta/100.;

        //this.mesh.position.y *= 0.5 + Math.sin(delta) * 10 ;
        //console.log(this.time);

        this.mesh.material.uniforms.uTime.value = this.time;
        this.mesh.material.uniforms.uTime.needsUpdate = true
    }
}
