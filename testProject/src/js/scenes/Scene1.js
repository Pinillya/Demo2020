import { codeExampleSphere } from '../objects/codeExampleSphere'

export class Scene1 {
    // contains all the objects of that scene.
    // onDestyroy
    // onInit
    // onAnimate
    // timeline

    constructor (scene) {
        this.sceneObjects = [];
        this.name = 'Scene1';
        this.scene = scene;
    }

    onInit () {
        var basicSphere = new codeExampleSphere;
        this.sceneObjects.push(basicSphere);
        this.scene.add(basicSphere.mesh);
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