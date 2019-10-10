import { Scene1 } from './js/scenes/Scene1';
import { Scene2 } from './js/scenes/Scene2';
import { InsideObjShaderScene } from './js/scenes/InsideObjShaderScene';


import * as THREE from 'three';


let selectedScene;
let prevSelectedScene;
function onSceneChange(sceneItem) {
    if (selectedScene) {
        prevSelectedScene = selectedScene;
        prevSelectedScene.destroy();
    }
    selectedScene = sceneItem;
}

export class ContentManagment {
    constructor(scenes, scene, camera) {
        this.getMouseEvents();
        this.onInit();
        this.sceneActive = false;
        this.variableActive = false;
        this.scenes = scenes;
        this.camera = camera;
        this.scene = scene;

        this.selectedObject;
        this.prevSelectedObject;
    }

    onInit() {
        let that = this;
        document.addEventListener( 'mousedown', function () {
            that.onDocumentMouseDown(event, that);
        });
    }

    onDocumentMouseDown(e, that) {
        if (selectedScene && selectedScene.sceneObjects) {
            let mouseVector = new THREE.Vector3();
            mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
            mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );

            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouseVector, this.camera);
            let intersects = raycaster.intersectObjects( this.scene.children );

            if (intersects.length) {
                that.onObjectChange(intersects[0].object);
            }
        }
    }

    addAllScene(scene) {
        this.scenes = {
            scene1: new Scene1(scene),
            scene2: new Scene2(scene),
            shaderScene: new InsideObjShaderScene(scene)
        };
        this.setupSceneButtons();
    }

    // scene
    setupSceneButtons() {
        const parentObject = document.getElementById('list-items-scenes');
        const that = this;

        let oldVariables = parentObject.getElementsByClassName('button');
        for (let i = oldVariables.length-1; i >= 0; i--) {
            oldVariables[i].parentNode.removeChild(oldVariables[i]);
        }

        for (var item in this.scenes) {
            const scene = this.scenes[item];
            var btn = document.createElement("BUTTON");   // Create a <button> element
            btn.className = "button list";
            btn.id = item;
            btn.innerHTML = scene.name + "<div class=\"line\"></div> ";
            btn.addEventListener("mouseup", function () {
                that.sceneButtonPressed(event, that);
            });
            parentObject.appendChild(btn);
        }

        //onSceneChange(that.scenes['shaderScene']);
        onSceneChange(that.scenes['shaderScene']);
        that.scenes['shaderScene'].activate();
    }

    sceneButtonPressed(event, that) {
        onSceneChange(that.scenes[event.srcElement.id]);
        that.scenes[event.srcElement.id].activate();
    }

    // variables
    onObjectChange(objectItem) {
        for (let i = 0; i < selectedScene.sceneObjects.length; i++) {
            if (selectedScene.sceneObjects[i].mesh === objectItem) {
                if (this.selectedObject) {
                    this.prevSelectedObject = this.selectedObject;
                }
                this.selectedObject = selectedScene.sceneObjects[i];
                if (this.prevSelectedObject != this.selectedObject) {
                    this.setupVariableButtons();
                }
            }
        }
    }

    setupVariableButtons() {
        const parentObject = document.getElementById('list-items-variables');
        const that = this;

        let oldVariables = parentObject.getElementsByClassName('button');
        for (let i = oldVariables.length-1; i >= 0; i--) {
            oldVariables[i].parentNode.removeChild(oldVariables[i]);
        }

        let index = 0;
        for (var item in this.selectedObject.variables) {
            let valValue = this.selectedObject.variables[item];
            let thisIndex = index;
            let thisItem = item;
            var btn = document.createElement("BUTTON");   // Create a <button> element
            btn.className = "button list";
            btn.innerHTML = item +   '<input type=\"text\" id=\"input\">' ;

            btn.oninput = function() {
                console.log(input[thisIndex].value, thisIndex, that.selectedObject.variables[thisItem], thisItem);
                //console.log(that.selectedObject.variables[item],  inputs[thisIndex].value);
                that.selectedObject.variables[thisItem] = input[thisIndex].value;
            };
            parentObject.appendChild(btn);

            index++;
        }
    }

    getMouseEvents() {
        const that = this;
        let buttons = document.getElementsByClassName("button");
        Array.prototype.forEach.call(buttons, function (button) {
            button.addEventListener("mouseup", function () {
                that.mouseUp(event, that)
            });
        });
    }

    mouseUp(event, that) {
        if (event.srcElement.id === 'scene') {
            that.sceneToggle(that);
        }
        if (event.srcElement.id === 'variables') {
            that.variableToggle(that);
        }
    }

    sceneToggle(that) {
        const scenetable = document.getElementById('scenetable');
        if (that.sceneActive) {
            that.sceneActive = false;
            scenetable.style.display = 'none';
        } else {
            that.sceneActive = true;
            scenetable.style.display = 'block';
        }
    }

    variableToggle(that) {
        const variabletable = document.getElementById('variabletable');
        if (that.variableActive) {
            that.variableActive = false;
            variabletable.style.display = 'none';
        } else {
            that.variableActive = true;
            variabletable.style.display = 'block';
        }
    }
}