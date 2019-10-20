import * as THREE from 'three';


export class UI {
    constructor(scenes, scene, cm) {
        this.scenes = scenes;
        this.scenetableActive = false;
        this.variableActive = false;

        this.scene = scene;

        this.selectedObject;
        this.prevSelectedObject;

        this.cm = cm;

        this.getMouseEvents();
        this.onInit();
    }

    setActiveScene (sceneItem) {
        this.cm.setActiveScene(sceneItem);
    }

    onInit() {
        let that = this;
        document.addEventListener( 'mousedown', function () {
            that.setObjectFocus(that.getObjectPressed(event));
        });

        this.setupSceneButtons();
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

    // variables
    setObjectFocus(objectItem) {
        if (objectItem) {
            const selectedScene = this.cm.getActiveScene();
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
    }

    sceneButtonPressed(event, that) {
        this.setActiveScene(that.scenes[event.srcElement.id]);
        that.scenes[event.srcElement.id].activate();
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


    sceneToggle(that) {
        const scenetable = document.getElementById('scenetable');
        if (that.scenetableActive) {
            that.scenetableActive = false;
            scenetable.style.display = 'none';
        } else {
            that.scenetableActive = true;
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

    getObjectPressed(e) {
        const scene = this.cm.getActiveScene();
        if (scene && scene.sceneObjects) {
            let mouseVector = new THREE.Vector3();
            mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
            mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );

            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouseVector, scene.camera);
            let intersects = raycaster.intersectObjects( this.scene.children );

            if (intersects.length) {
                return intersects[0].object;
            }
        }
    }


}