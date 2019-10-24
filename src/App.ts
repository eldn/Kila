import { IGame } from "./game/IGame";
import { LevelManager } from "./engines/core/world/LevelManager";
import { Shader } from "./engines/core/gl/shaders/Shader";
import { Engine } from "./engines/core/Engine";
import { PerspectiveCamera } from "./engines/core/world/cameras/PerspectiveCamera";
import { InputManager } from "./engines/core/input/InputManager";
import { KEY_CODE_MACRO } from "./engines/core/define/Macro";
import { Vector3 } from "./engines/core/math/Vector3";
import { TEntity } from "./engines/core/world/Entity";
import { Level } from "./engines/core/world/Level";



class TestGame implements IGame {


  private camera: PerspectiveCamera;

  updateReady(): void {
    // Load the test level. This should be configurable.
    LevelManager.changeLevel("test 1");
  }

  update(time: number): void {


    this.processInput();

  }

  render(shader: Shader): void {

  }


  private processInput(): void {

    if (!this.camera) {
      let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera;
      if (activeCamera) {

        this.camera = activeCamera;
        let curLevel: Level = LevelManager.activeLevel;

        if (curLevel) {
          let box: TEntity = curLevel.sceneGraph.getEntityByName('testMesh');
          if (box) {
            // this.camera.lookAt(box.getWorldPosition());
            // this.camera.lookAt(new Vector3(0, 0, 0));
          }
        }
      }
      return;
    }

    let cameraPos: Vector3 = this.camera.getWorldPosition();
    let cameraSpeed: number = 0.05;
    let cameraFront: Vector3 = new Vector3(0, 0, -1);
    let cameraUp: Vector3 = new Vector3(0, 1, 0);

    if (InputManager.isKeyDown(KEY_CODE_MACRO.w)) {
      cameraPos = cameraPos.add(cameraFront.multiplyValue(cameraSpeed));
    }

    if (InputManager.isKeyDown(KEY_CODE_MACRO.s)) {
      cameraPos = cameraPos.subtract(cameraFront.multiplyValue(cameraSpeed));
    }

    if (InputManager.isKeyDown(KEY_CODE_MACRO.a)) {
      cameraPos = cameraPos.subtract(cameraFront.cross(cameraUp).normalize().multiplyValue(cameraSpeed));
    }

    if (InputManager.isKeyDown(KEY_CODE_MACRO.d)) {
      cameraPos = cameraPos.add(cameraFront.cross(cameraUp).normalize().multiplyValue(cameraSpeed));
    }

    let curPos: Vector3 = this.camera.getWorldPosition();
    let newPos: Vector3 = this.camera.transform.position.add(curPos.subtract(cameraPos));
    console.log(`new cameraPos:  [${newPos.x},${newPos.y},${newPos.z}`);
  }

}


let engine: Engine;

window.onload = function () {
  engine = new Engine(800, 600);
  engine.start(new TestGame(), "viewport");
}

window.onresize = function () {
  engine.resize();
}