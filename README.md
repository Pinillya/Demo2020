# DemoTools
[Setup](#Setup)
[Making a new demo](#Making-a-new-demo)

[Making a new scene](#Making-a-new-scene)

[Making a new object](#Making-a-new-object)

[Current webpack file-loader support](#Current-webpack-file-loader-support)




---

## Setup:

Clone the project
```
$ git clone https://github.com/Pinillya/DemoTools.git
```

navigate to the testProject project.

run npm install
```
$ npm install
```

build the project
```
$ npm run build
```

start a webserver at 8080
```
$ npm run start:dev
```

---

## Making a new demo:
A demo contains the scenes you wish to use, the scene you wish to init upon page refresh and content management. Demo is the bond between the main components of the demo, but does nothing on its own.
You have an option to add a ui as well while building your demo.
An example demo has been added in
*src/Demos/ExampleDemo.js*

To initiate the desired demo, add your demo to the demo variable in  index.js

*src/index.js*
`demo = new ExampleDemo(scene);`

---
## Making a new scene
The scene has a basic camera, a system for adding objects and making the animationloop available for the objects in that scene.
The scene extends the basic scene *(src/js/scenes/BasicScene)* and can be created with a few lines of code.The scene is initiated in the [demo](#Making-a-new-demo)

```
import { codeExampleSphere } from '../objects/codeExampleSphere'
import { BasicScene } from "./BasicScene";

export class Scene1 extends BasicScene {
    onActivated () {
        let basicSphere = new codeExampleSphere;
        this.addObject(basicSphere);
    }
}
```
In this example, we add a basic sphere to the scene.

---
## Making a new object

The object you create needs to contain this.mesh with a mesh that can be added to the scene.
If you want to change the camera, create a camera in your obj, then assign the camera in the scene using the object.
If you want access to a variables of an object while running the scene in your browser, add that variable to this.variables{}.
If you want the object to animate, sett this.animate = true; and add onAnimate (step) {}


*../objects/codeExampleSphere*
```
import * as THREE from 'three';
export class codeExampleSphere {
    constructor () {
        this.geometry = new THREE.SphereGeometry( 5, 32, 32 );
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.animate = true;
        this.variables = {
            posX: 1,
            posY: 1
        };
    }
    onAnimate (step) {
    }
}
```

OBS: The best practice for adding an object and for adding a GLTF scene has not been established yet as we're still experimenting with it.

---
## Current webpack file-loader support:

Meaning, that if you want to add more you need to find the relevant file loader and add it to the webpack.config.js

html,
glb,
png,
jpe,
gif


