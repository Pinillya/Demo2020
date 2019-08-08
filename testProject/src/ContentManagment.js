import { Scene1 } from './js/scenes/Scene1';
import { Scene2 } from './js/scenes/Scene2';

//let scenes = {};

let selectedScene;
let prevSelectedScene;
function onSceneChange(sceneItem) {
    if (selectedScene) {
        prevSelectedScene = selectedScene;
        prevSelectedScene.onDestroy();
    }
    selectedScene = sceneItem;
}

export class ContentManagment {
    constructor(scenes) {
        this.getMouseEvents();
        this.onInit();
        this.sceneActive = false;
        this.scenes = scenes;
    }

    onInit() {
    }

    addAllScene(scene) {
        this.scenes = {
            scene1: new Scene1(scene),
            scene2: new Scene2(scene)
        };
        this.setupSceneButtons();
    }

    setupSceneButtons() {
        const parentObject = document.getElementById('list-items');

        const that = this;

        for (var item in this.scenes) {
            const scene = this.scenes[item];
            var btn = document.createElement("BUTTON");   // Create a <button> element
            btn.className = "button list";
            btn.id = item;
            btn.innerHTML = scene.name + "<div class=\"line\"></div> </button> ";
            btn.addEventListener("mouseup", function () {
                that.sceneButtonPressed(event, that);
            });
            parentObject.appendChild(btn);
        }
    }

    sceneButtonPressed(event, that) {
        onSceneChange(that.scenes[event.srcElement.id]);
        that.scenes[event.srcElement.id].onActivated();
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
    }

    sceneToggle(that) {
        console.log('moo');
        const scenetable = document.getElementById('scenetable');
        if (that.sceneActive) {
            that.sceneActive = false;
            scenetable.style.display = 'none';
        } else {
            that.sceneActive = true;
            scenetable.style.display = 'block';
        }
    }
}