import * as THREE from 'three';

export class BasicScene {
    constructor (scene, camera = {}) {
        this.sceneObjects = [];
        this.scene = scene;
        this.camera = camera;
        this.name = this.constructor.name;

        this.setupBasicCamera();
    }

    setupBasicCamera () {
        //if (this.camera.length == 0) {
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            // position and point the camera to the center of the scene
            this.camera.position.x = 105;
            this.camera.position.y = 106;
            this.camera.position.z = 103;
            this.camera.lookAt(this.scene.position);
        //}
    }

    addObject (obj) {
        if (obj && obj.mesh) {
            this.sceneObjects.push(obj);
            this.scene.add(obj.mesh);
            this.onObjectAdded();
        } else {
            console.error('The object you tried to add to ' + this.name + ' has no mesh we can add to the scene')
        }
        if (obj && obj.animate) {
            if (!obj.onAnimate) {
                console.error('The object you tried to add to ' + this.name + ' has been instructed to animate, but has no onAnimate function')
            }
        }
    }

    onObjectAdded() {
    }

    onSceneAnimation(timer) {
        if (this.sceneObjects && this.sceneObjects.length > 0) {
            this.sceneObjects.forEach( function(child) {
                if (child.animate) {
                    child.onAnimate(timer);
                }
            })
        }
    }

    activate() {
        this.onActivated();
    }
    onActivated() {}

    destroy() {
        console.log(this.sceneObjects);
        for (let i = 0; i < this.sceneObjects.length; i++) {
            this.scene.remove(this.sceneObjects[i].mesh);

            if (this.sceneObjects[i].material) {
                this.sceneObjects[i].material.dispose();
            }

            if (this.sceneObjects[i].geometry) {
                this.sceneObjects[i].geometry.dispose();
            }

        }
        this.sceneObjects = [];
    }
    onDestroy() {}
}