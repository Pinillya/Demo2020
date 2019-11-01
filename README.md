# DemoTools
[Setup](#Setup)
[Making a new demo](#Making-a-new-demo)
[Making a new scene](#Making-a-new-scene)
[Making a new object](#Making-a-new-object)


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
