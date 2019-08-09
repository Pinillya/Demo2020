import { codeExampleCube } from '../objects/codeExampleCube'
import { MyParticleSystem } from '../objects/MyParticleSystem'
import { BasicScene } from "./BasicScene";


export class Scene2 extends BasicScene {
    onActivated () {
        let basicCube = new codeExampleCube;
        this.addObject(basicCube);

        let partSystem = new MyParticleSystem(10, 10);
        this.addObject(partSystem);
    }
}