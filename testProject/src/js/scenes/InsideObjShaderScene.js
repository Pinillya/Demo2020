import { shadedGeometry } from '../objects/shadedGeometry'
import { shaderTheDriveHome } from '../objects/shaderTheDriveHome'
import { shaderRain } from '../objects/shaderRain'

import { BasicScene } from "./BasicScene";

export class InsideObjShaderScene extends BasicScene {
    onActivated () {
/*        let basicSphere = new shadedGeometry;
        this.addObject(basicSphere);*/

        //this.camera.position.z = 500;
        //let driveHome = new shaderTheDriveHome;
        //this.addObject(driveHome);

        let rain = new shaderRain;
        this.addObject(rain);
    }
}