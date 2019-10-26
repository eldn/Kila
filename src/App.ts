import { IGame } from "./game/IGame";
import { LevelManager } from "./engines/core/world/LevelManager";
import { Shader } from "./engines/core/gl/shaders/Shader";
import { Engine } from "./engines/core/Engine";
import { PerspectiveCamera } from "./engines/core/world/cameras/PerspectiveCamera";
import { InputManager, MESSAGE_MOUSE_WHEEL, MouseContext } from "./engines/core/input/InputManager";
import { KEY_CODE_MACRO } from "./engines/core/define/Macro";
import { Vector3 } from "./engines/core/math/Vector3";
import { TEntity } from "./engines/core/world/Entity";
import { Level } from "./engines/core/world/Level";
import { Vector2 } from "./engines/core/math/Vector2";
import { Renderer } from "./engines/core/renderer/Renderer";
import { Message } from "./engines/core/message/Message";
import { MessageBus } from "./engines/core/message/MessageBus";
import { IMessageHandler } from "./engines/core/message/IMessageHandler";



class TestGame implements IGame, IMessageHandler {


  private camera: PerspectiveCamera;
  private firstMouse: boolean = true;
  private lastX: number;
  private lastY: number;

  private yaw: number = -90;
  private pitch: number = 0;

  updateReady(): void {
    // Load the test level. This should be configurable.
    LevelManager.changeLevel("test 1");
  }

  update(time: number): void {


    this.processInput(time);

  }

  render(shader: Shader): void {

  }

  onMessage(message: Message): void {
    if (message.code == MESSAGE_MOUSE_WHEEL) {
      let event: MouseContext = message.context;
      let angel: number = Renderer.windowViewport.fov / (Math.PI / 180);
      let sensitivity: number = 0.1;

      if (angel >= 1.0 && angel <= 45.0)
        angel -= event.wheelDelta * sensitivity;

      if (angel <= 1.0)
        angel = 1.0;

      if (angel >= 45.0)
        angel = 45.0;

      Renderer.windowViewport.fov = angel * (Math.PI / 180);
    }
  }



  private processInput(dt: number): void {

    //# region start 初始化摄像机
    if (!this.camera) {
      let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera as PerspectiveCamera;
      if (activeCamera) {

        this.camera = activeCamera;
        let curLevel: Level = LevelManager.activeLevel;

        if (curLevel) {
          let box: TEntity = curLevel.sceneGraph.getEntityByName('testMesh');
          if (box) {
            //  this.camera.forward = box.getWorldPosition();
          }
        }

        this.lastX = Renderer.windowViewport.width / 2;
        this.lastY = Renderer.windowViewport.height / 2;

        Message.subscribe(MESSAGE_MOUSE_WHEEL, this);
      }
      return;
    }
    //# region end 初始化摄像机

    let cameraPos: Vector3 = this.camera.getWorldPosition();
    let cameraSpeed: number = 2.5 * dt / 1000;
    let cameraFront: Vector3 = new Vector3(0, 0, -1);
    let cameraUp: Vector3 = new Vector3(0, 1, 0);


    // #region start 俯仰角度计算
    let mousePos: Vector2 = InputManager.getMousePosition();
    let xpos: number = mousePos.x;
    let ypos: number = mousePos.y;
    if (this.firstMouse) {
      this.lastX = xpos;
      this.lastY = ypos;
      this.firstMouse = false;
    }

    let xoffset: number = xpos - this.lastX;
    let yoffset: number = this.lastY - ypos;

    this.lastX = xpos;
    this.lastY = ypos;

    let sensitivity: number = 0.1;
    xoffset *= sensitivity;
    yoffset *= sensitivity;

    this.yaw += xoffset;
    this.pitch += yoffset;

    if (this.pitch > 89.0)
      this.pitch = 89.0;
    if (this.pitch < -89.0)
      this.pitch = -89.0;

    let front: Vector3 = new Vector3();
    front.x = Math.cos(this.radians(this.yaw)) * Math.cos(this.radians(this.pitch));
    front.y = Math.sin(this.radians(this.pitch));
    front.z = Math.sin(this.radians(this.yaw)) * Math.cos(this.radians(this.pitch));
    cameraFront = front.normalize();


    // 更新摄像机看向的目标点
    // 保证摄像机永远看向的目标位置是相机z轴相反方向（永远指向屏幕中心（0,0,0））
    this.camera.forward = Vector3.add(cameraPos, cameraFront);


    // #region end 俯仰角度计算
    try {
      console.log(`cameraSpeed:${cameraSpeed},cameraPos:`, cameraPos, ',cameraFront:', cameraFront)
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
      if (!curPos.equals(cameraPos)) {
        let newPos: Vector3 = this.camera.transform.position.add(cameraPos.subtract(curPos));
        console.log(`new cameraPos:  [${newPos.x},${newPos.y},${newPos.z}]`);
      }
    }
    catch (e) {
      console.error(e);
      // TODO 错误处理
    }




    // 绕（0,0,0）旋转
    // let radius : number = 10.0;
    // let t : number = Date.now() / 1000;
    // let camX : number = Math.sin(t) * radius;
    // let camZ : number = Math.cos(t) * radius;
    // this.camera.transform.position.set(camX, 0.0, camZ);


  }

  public radians(degrees: number): number {
    return degrees * (Math.PI / 180.0);
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