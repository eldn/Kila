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
import { Vector2 } from "./engines/core/math/Vector2";



class TestGame implements IGame {


  private camera: PerspectiveCamera;
  private firstMouse : boolean = true;
  private lastX : number;
  private lastY : number;
  private yaw : number = 0;
  private pitch : number = 0;

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
      let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera as PerspectiveCamera;
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

    // let mousePos : Vector2 = InputManager.getMousePosition();
    // let xpos : number = mousePos.x;
    // let ypos : number = mousePos.y;
    // if(this.firstMouse){
    //     this.lastX = xpos;
    //     this.lastY = ypos;
    //     this.firstMouse = false;
    // }

    // let xoffset : number = xpos - this.lastX;
    // let yoffset : number = this.lastY - ypos; 
    // this.lastX = xpos;
    // this.lastY = ypos;

    // let sensitivity : number = 0.05;
    // xoffset *= sensitivity;
    // yoffset *= sensitivity;

    // this.yaw += xoffset;
    // this.pitch += yoffset;

    // if(this.pitch > 89.0)
    //     this.pitch = 89.0;
    // if(this.pitch < -89.0)
    //     this.pitch = -89.0;

    // let front : Vector3 = new Vector3();
    // front.x = Math.cos(this.radians(this.yaw)) * Math.cos(this.radians(this.pitch));
    // front.y = Math.sin(this.radians(this.pitch));
    // front.z = Math.sin(this.radians(this.yaw)) * Math.cos(this.radians(this.pitch));
    // cameraFront = front.normalize();

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
    if(!curPos.equals(cameraPos)){
      let newPos : Vector3 = this.camera.transform.position.add(cameraPos.subtract(curPos));
      console.log(`new cameraPos:  [${newPos.x},${newPos.y},${newPos.z}]`);
    }
    
    
  }

  public radians(degrees  : number) :number{
    return degrees * (Math.PI/180);
  }

 

}


let engine: Engine;

window.onload = function () {
  engine = new Engine(600, 600);
  engine.start(new TestGame(), "viewport");
}

window.onresize = function () {
  engine.resize();
}