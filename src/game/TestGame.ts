import { CoreEngine } from "../engine/core/CoreEngine";
import { Ticker } from "../engine/core/utils/Ticker";
import { Scene } from "../engine/core/world/Scene";
import { PerspectiveCamera } from "../engine/core/world/cameras/PerspectiveCamera";
import { Vector3 } from "../engine/core/math/Vector3";
import { Mesh } from "../engine/core/graphics/Mesh";
import { Material } from "../engine/core/material/Material";
import { MeshRendererComponent } from "../engine/core/components/MeshRendererComponent";
import { GameObject } from "../engine/core/world/GameObject";
import { RendererViewportCreateInfo, ViewportProjectionType } from "../engine/core/renderering/RendererViewport";
import { Renderer } from "../engine/core/renderering/Renderer";
import { AssetManager } from "../engine/core/assets/AssetManager";
import { InputManager } from "../engine/core/input/InputManager";
import { ComponentManager } from "../engine/core/components/ComponentManager";
import { BehaviorManager } from "../engine/core/behaviors/BehaviorManager";


let engine: CoreEngine;
let renderer : Renderer;


window.onload =  ()=> {
  engine = new CoreEngine();
  engine.start();
  
  test();
}

window.onresize = function () {
  renderer.Resize();
}

function test(){
  let rendererViewportCreateInfo: RendererViewportCreateInfo = new RendererViewportCreateInfo();
  rendererViewportCreateInfo.elementId = "viewport";
  rendererViewportCreateInfo.projectionType = ViewportProjectionType.PERSPECTIVE;
  rendererViewportCreateInfo.width = 640;
  rendererViewportCreateInfo.height = 480;
  rendererViewportCreateInfo.nearClip = 0.1;
  rendererViewportCreateInfo.farClip = 1000.0;
  rendererViewportCreateInfo.fov = 45.0 * Math.PI / 180;
  rendererViewportCreateInfo.x = 0;
  rendererViewportCreateInfo.y = 0;
  renderer = new Renderer( rendererViewportCreateInfo );
  
  // Initialize various sub-systems.
  AssetManager.initialize();
  InputManager.initialize( renderer.windowViewportCanvas );
  ComponentManager.initialize();
  BehaviorManager.initialize();
  

  let camera : PerspectiveCamera = new PerspectiveCamera("DEFAULT_CAMERA");
  camera.lookAt(new Vector3(0, 0, -1));
  
  let scene : Scene = new Scene(camera, renderer);
  scene.load();


  let mesh: Mesh = new Mesh("assets/models/plane3.obj");
  let material: Material = new Material();
  let meshRender: MeshRendererComponent = new MeshRendererComponent(mesh, material);

  let planeObject: GameObject = new GameObject("plane");
  planeObject.transform.z = -10;
  planeObject.transform.rotationX = 45;
  planeObject.transform.rotationY = 45;
  planeObject.addComponent(meshRender);
  scene.addObject(planeObject);


  Ticker.startTick((timeDelta : number)=>{
    scene.tick( timeDelta );
  }, this)

}