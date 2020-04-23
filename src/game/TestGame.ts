import { IGame } from "../engine/game/IGame";
import { Shader } from "../engine/core/gl/shaders/Shader";
import { CoreEngine } from "../engine/core/CoreEngine";
import { PerspectiveCamera } from "../engine/core/world/cameras/PerspectiveCamera";
import { InputManager, MESSAGE_MOUSE_WHEEL, MouseContext, MESSAGE_TOUCH_START, TouchContext, MESSAGE_TOUCH_MOVE } from "../engine/core/input/InputManager";
import { KEY_CODE_MACRO } from "../engine/core/define/Macro";
import { Scene } from "../engine/core/world/Scene";
import { Vector2 } from "../engine/core/math/Vector2";
import { Renderer } from "../engine/core/renderering/Renderer";
import { Message } from "../engine/core/message/Message";
import { IMessageHandler } from "../engine/core/message/IMessageHandler";
import { Mesh } from "../engine/core/graphics/Mesh";
import { MeshRendererComponent } from "../engine/core/components/MeshRendererComponent";
import { Material } from "../engine/core/renderering/Material";
import { GameObject } from "../engine/core/world/GameObject";
import { Texture } from "../engine/core/graphics/Texture";


class TestGame implements IGame, IMessageHandler {


  private camera: PerspectiveCamera;
  private firstMouse: boolean = true;
  private lastX: number;
  private lastY: number;
  private _scene: Scene;

  constructor(){
    this._scene = new Scene("testScene", "Test Scene!");
    this._scene.load();
  }

  public get scene(): Scene {
    return this._scene;
  }
  
  public set scene(value: Scene) {
    this._scene = value;
  }


  private obj :GameObject ;
  updateReady(): void {
    let mesh : Mesh = new Mesh("assets/models/plane3.obj");
    let diffuse : Texture = new Texture("assets/textures/bricks2.jpg");
    let normal : Texture = new Texture("assets/textures/bricks2_normal.png");
    let dispMap : Texture = new Texture("assets/textures/bricks2_disp.jpg");
    let material : Material = new Material();
    let meshRender : MeshRendererComponent = new MeshRendererComponent(mesh, material);
    
    let planeObject : GameObject = new GameObject("plane");
    planeObject.addComponent(meshRender);
    planeObject.transform.position.set(0, 0, 300);
    planeObject.transform.rotation.degX = 0.2;
    this.addObject(planeObject);

    this.obj = planeObject;
  }

  addObject(obj : GameObject) : void {
    if(this._scene && obj){
      this._scene.addObject(obj);  
    }
  }

  update(time: number): void {

    this.processInput(time);

    if(this.obj){
      this.obj.transform.rotation.degZ += time *0.1;
    }
    

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
      let activeCamera: PerspectiveCamera = this._scene.activeCamera as PerspectiveCamera;
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

  getRunningScene() : Scene{
    return this._scene;
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