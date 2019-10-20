export class ContentManagment {
    constructor(scene) {
        this.activeScene;
        this.prevSelectedScene;
        this.scene = scene;
    }

    activateScene (scene) {
    }

    removeScene() {

    }

    onSceneChange(sceneItem) {
        if (this.selectedScene) {
            this.prevSelectedScene = this.selectedScene;
            this.prevSelectedScene.destroy();
        }
        this.selectedScene = sceneItem;
        sceneItem.activate();

    }

    setActiveScene(sceneItem) {
        this.activeScene = sceneItem;
        this.onSceneChange(sceneItem);
    }

    getActiveScene() {
        return this.activeScene;
    }
}
