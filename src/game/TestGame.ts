import { IGame } from "../engine/game/IGame";
import { SceneManager } from "../engine/core/world/SceneManager";
import { Shader } from "../engine/core/gl/shaders/Shader";
import { CoreEngine } from "../engine/core/CoreEngine";
import { PerspectiveCamera } from "../engine/core/world/cameras/PerspectiveCamera";
import { InputManager, MESSAGE_MOUSE_WHEEL, MouseContext, MESSAGE_TOUCH_START, TouchContext, MESSAGE_TOUCH_MOVE } from "../engine/core/input/InputManager";
import { KEY_CODE_MACRO } from "../engine/core/define/Macro";
import { Vector3 } from "../engine/core/math/Vector3";
import { GameObject } from "../engine/core/world/GameObject";
import { Scene } from "../engine/core/world/Scene";
import { Vector2 } from "../engine/core/math/Vector2";
import { Renderer } from "../engine/core/renderering/Renderer";
import { Message } from "../engine/core/message/Message";
import { MessageBus } from "../engine/core/message/MessageBus";
import { IMessageHandler } from "../engine/core/message/IMessageHandler";



class TestGame implements IGame, IMessageHandler {


  private camera: PerspectiveCamera;
  private firstMouse: boolean = true;
  private lastX: number;
  private lastY: number;

  updateReady(): void {
    // Load the test level. This should be configurable.
    // SceneManager.runScene("test 1");


    
  }

  update(time: number): void {

    this.processInput(time);

  }

  render(shader: Shader): void {

  }

  private _touchStart : Vector2 = Vector2.zero;
  onMessage(message: Message): void {
    if (!this.camera) {
      return;
    }

    if (message.code == MESSAGE_MOUSE_WHEEL) {  
        let event: MouseContext = message.context;
        this.camera.processMouseScroll(event.wheelDelta);
    } else if (message.code == MESSAGE_TOUCH_START){
       let event: TouchContext = message.context;
       this._touchStart.set(event.position.x, event.position.y);
    } else if(message.code == MESSAGE_TOUCH_MOVE){
       let event: TouchContext = message.context;
       this.camera.processMouseMovement(-(event.position.x - this._touchStart.x) / 2, -(event.position.y - this._touchStart.y) / 2, true);
    }
  }



  private processInput(dt: number): void {

    //# region start 初始化摄像机
    if (!this.camera) {
      let activeCamera: PerspectiveCamera = SceneManager.activeLevelActiveCamera as PerspectiveCamera;
      if (activeCamera) {
        this.camera = activeCamera;
        this.lastX = Renderer.windowViewport.width / 2;
        this.lastY = Renderer.windowViewport.height / 2;
        Message.subscribe(MESSAGE_MOUSE_WHEEL, this);
        Message.subscribe(MESSAGE_TOUCH_START, this);
        Message.subscribe(MESSAGE_TOUCH_MOVE, this);


        let canvas : HTMLCanvasElement = Renderer.windowViewport.canvas;
        let delta : number = 10000;
        canvas.addEventListener("up", ()=>{
          this.camera.processKeyboard(KEY_CODE_MACRO.w, delta);
        }, false);
        canvas.addEventListener("down", ()=>{
          this.camera.processKeyboard(KEY_CODE_MACRO.s, delta);
        }, false);
        canvas.addEventListener("left", ()=>{
          this.camera.processKeyboard(KEY_CODE_MACRO.a, delta);
        }, false);
        canvas.addEventListener("right", ()=>{
          this.camera.processKeyboard(KEY_CODE_MACRO.d, delta);
        }, false);
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
  }

}


let engine: CoreEngine;

window.onload = function () {
  engine = new CoreEngine(600, 600);
  engine.start(new TestGame(), "viewport");
}

window.onresize = function () {
  engine.resize();
}