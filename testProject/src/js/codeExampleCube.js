import * as THREE from 'three';

export class codeExampleCube {
    constructor () {
        this.cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
        this.cubeMaterial = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
        this.mesh.name = 'codeExampleCube';

        this.animate = true;
    }

    onAnimate (step) {
        console.log('1')

    }
}
