import { ShaderPlane } from '../objects/ShaderPlane'
import { BasicScene } from "./BasicScene";

export class OverTheMoon extends BasicScene {
    onActivated () {
        let shaderPlane = new ShaderPlane(this.camera);
        this.addObject(shaderPlane);
    }
}