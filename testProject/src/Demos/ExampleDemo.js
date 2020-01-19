import { Scene1 } from '../js/scenes/Scene1';
import { Scene2 } from '../js/scenes/Scene2';
import { SceneEspen } from '../js/scenes/SceneEspen';
import { InsideObjShaderScene } from '../js/scenes/InsideObjShaderScene';
import { OverTheMoon } from '../js/scenes/OverTheMoon'
import { UI } from '../js/utilities/UI'
import {ContentManagment } from '../ContentManagment'

export class ExampleDemo {
    constructor(scene) {
        this.scenes;

        this.addAllScene(scene);
        this.contentManagment = new ContentManagment(scene);
        this.ui = new UI(this.getAllScenes(), scene, this.contentManagment);

        this.onInit();
    }

    onInit () {
        this.contentManagment.setActiveScene(this.scenes['overTheMoon']);
    }
    addAllScene(scene) {
        this.scenes = {
            scene1: new Scene1(scene),
            scene2: new Scene2(scene),
            sceneEspen: new SceneEspen(scene),
            shaderScene: new InsideObjShaderScene(scene),
            overTheMoon: new OverTheMoon(scene)
        };
    }

    getAllScenes () {
        return this.scenes;
    }

    getActiveScene () {
        return this.contentManagment.getActiveScene();
    }

    getCamera() {
        return this.getActiveScene().camera;
    }
}