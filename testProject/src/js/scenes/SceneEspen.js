import { codeExampleCube } from '../objects/codeExampleCube'
import { GLTFObject } from '../objects/GLTFObject'
import { BasicScene } from "./BasicScene";


export class SceneEspen extends BasicScene {
    onActivated () {
        let partSystem = new GLTFObject;
        setTimeout(()=> {
        	this.addObject(partSystem);
        }, 500)
        if (partSystem.camera){
        	this.camera = partSystem.camera;
        }
    }
}