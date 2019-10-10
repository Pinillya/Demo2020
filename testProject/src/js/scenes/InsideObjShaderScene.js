import { shadedGeometry } from '../objects/shadedGeometry'
import { BasicScene } from "./BasicScene";

export class InsideObjShaderScene extends BasicScene {
    onActivated () {
        let basicSphere = new shadedGeometry;
        this.addObject(basicSphere);
    }
}