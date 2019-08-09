// We need mesh and this.animate as the scene will use the variables.
// onAnimate is the animation loop used if this.animate is true.

import * as THREE from 'three';
export class codeExampleSphere {
    constructor () {
        this.geometry = new THREE.SphereGeometry( 5, 32, 32 );
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.animate = true;
        this.variables = {
            scale: 1,
            posX: 1,
            posY: 1
        };
    }
    onAnimate (step) {
        //this.geometry.scale(this.variables['scale'], this.variables['scale'], this.variables['scale'])
    }
}
