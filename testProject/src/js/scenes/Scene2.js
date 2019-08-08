import { codeExampleCube } from '../objects/codeExampleCube'


export class Scene2 {
    constructor (scene) {
        this.sceneObjects = [];
        this.name = 'Scene2';
        this.scene = scene;
    }

    onInit () {
        var basicCube = new codeExampleCube;
        this.sceneObjects.push(basicCube);
        this.scene.add(basicCube.mesh);
    }

    onSceneAnimation() {
        if (this.sceneObjects && this.sceneObjects.legnth > 0) {
            this.sceneObjects.children.forEach( function(child) {
                if (child.animate) {
                    child.onAnimate(timer);
                }
            })
        }
    }

    onActivated() {
        this.onInit();
    }

    onDestroy() {
        for (let i = 0; i < this.sceneObjects.length; i++) {
            this.scene.remove(this.sceneObjects[i].mesh);
            this.sceneObjects[i].material.dispose();
            this.sceneObjects[i].geometry.dispose();
        }
    }
}