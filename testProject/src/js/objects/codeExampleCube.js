import * as THREE from 'three';

export class codeExampleCube {
    constructor () {
        this.geometry = new THREE.BoxGeometry(3, 3, 3);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'codeExampleCube';

        this.animate = true;
    }

    onAnimate (step) {
        console.log('1')

    }
}
