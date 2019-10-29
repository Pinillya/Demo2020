import { codeExampleSphere } from '../objects/codeExampleSphere'

import { GLTFObject } from '../objects/GLTFObject'
import { BasicScene } from "./BasicScene";

export class SceneEspen extends BasicScene {
    onActivated () {

        let basicSphere = new codeExampleSphere;
        this.addObject(basicSphere);

        let sceneObject = new GLTFObject;
        setTimeout(()=> {
        	this.addObject(sceneObject);
            if (sceneObject.camera){
                this.camera = sceneObject.camera;
                console.log(this.camera);

                //this.camera.position.y = 12;
            }

        }, 500)

    }
}