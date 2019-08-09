export class BasicScene {
    constructor (scene) {
        this.sceneObjects = [];
        this.scene = scene;
        this.name = this.constructor.name;
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
        for (let i = 0; i < this.sceneObjects.length; i++) {
            this.scene.remove(this.sceneObjects[i].mesh);
            this.sceneObjects[i].material.dispose();
            this.sceneObjects[i].geometry.dispose();
        }
        this.sceneObjects = [];
    }
    onDestroy() {}
}