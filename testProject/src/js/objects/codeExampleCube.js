import * as THREE from 'three';

export class codeExampleCube {
    constructor () {
        this.geometry = new THREE.BoxGeometry(3, 3, 3);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'codeExampleCube';
        this.variables = {
            scale: 1,
            posX: 1,
            posY: 1
        };

        this.animate = true;
    }

    onAnimate (step) {
        this.mesh.position.x = this.variables.posX;
        this.mesh.position.y = this.variables.posY;
    }
}
