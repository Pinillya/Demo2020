import { shadedGeometry } from '../objects/shadedGeometry'
import { shaderTheDriveHome } from '../objects/shaderTheDriveHome'

import { BasicScene } from "./BasicScene";

export class InsideObjShaderScene extends BasicScene {
    onActivated () {
/*        let basicSphere = new shadedGeometry;
        this.addObject(basicSphere);*/

        let driveHome = new shaderTheDriveHome;
        this.addObject(driveHome);
    }
}