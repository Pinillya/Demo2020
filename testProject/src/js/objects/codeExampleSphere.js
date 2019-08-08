import * as THREE from 'three';

export class codeExampleSphere {
    constructor () {
        this.geometry = new THREE.SphereGeometry( 5, 32, 32 );
        this.material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'codeExampleSphere';

        this.animate = true;
    }

    onAnimate (step) {
        console.log('1')

    }
}
