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
      if (this.camera) {
        let event: MouseContext = message.context;
        this.camera.processMouseScroll(event.wheelDelta);
      }
    }
  }



  private processInput(dt: number): void {

    //# region start 初始化摄像机
    if (!this.camera) {
      let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera as PerspectiveCamera;
      if (activeCamera) {
        this.camera = activeCamera;
        this.lastX = Renderer.windowViewport.width / 2;
        this.lastY = Renderer.windowViewport.height / 2;
        Message.subscribe(MESSAGE_MOUSE_WHEEL, this);
      }
      return;
    }
    //# region end 初始化摄像机


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

    this.camera.processMouseMovement(xoffset, yoffset, true);
    // #region end 俯仰角度计算


    try {

      if (InputManager.isKeyDown(KEY_CODE_MACRO.w)) {
        this.camera.processKeyboard(KEY_CODE_MACRO.w, dt);
      }

      if (InputManager.isKeyDown(KEY_CODE_MACRO.s)) {
        this.camera.processKeyboard(KEY_CODE_MACRO.s, dt);
      }

      if (InputManager.isKeyDown(KEY_CODE_MACRO.a)) {
        this.camera.processKeyboard(KEY_CODE_MACRO.a, dt);
      }

      if (InputManager.isKeyDown(KEY_CODE_MACRO.d)) {
        this.camera.processKeyboard(KEY_CODE_MACRO.d, dt);
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