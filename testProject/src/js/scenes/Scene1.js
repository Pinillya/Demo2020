import { codeExampleSphere } from '../objects/codeExampleSphere'
import { BasicScene } from "./BasicScene";

export class Scene1 extends BasicScene {
    onActivated () {
        let basicSphere = new codeExampleSphere;
        this.addObject(basicSphere);
    }
}