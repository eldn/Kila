import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { Scene } from "../engine/core/Scene";
import Color from "../engine/math/Color";
import { WebGLRenderer } from "../engine/renderer/WebGLRenderer";
import { DirectionLight } from "../engine/light/DirectionLight";
import { Vector3 } from "../engine/math/Vector3";
import BoxGeometry from "../engine/geometry/BoxGeometry";
import { Mesh } from "../engine/core/Mesh";
import { BasicMaterial } from "../engine/material/BasicMaterial";
import { Ticker } from "../engine/utils/Ticker";
import AmbientLight from "../engine/light/AmbientLight";


let test = function () {

  let camera: PerspectiveCamera = new PerspectiveCamera();
  camera.aspect = innerWidth / innerHeight;
  camera.far = 100;
  camera.near = 0.1;
  camera.z = 3;

  let scene: Scene = new Scene({
    container: document.getElementById('container'),
    width: innerWidth,
    height: innerHeight,
    clearColor: new Color(0.4, 0.4, 0.4),
    camera: camera,
  });


  let boxGeometry: BoxGeometry = new BoxGeometry();
  boxGeometry.setAllRectUV([[0, 1], [1, 1], [1, 0], [0, 0]]);

  let colorBox: Mesh = new Mesh();
  colorBox.geometry = boxGeometry;
  colorBox.material = new BasicMaterial();
  colorBox.material.diffuse = new Color(0.8, 0, 0);
  colorBox.x = -1;
  colorBox.onUpdate = function () {
    this.rotationX += .5;
    this.rotationY += .5;
  }
  scene.addChild(colorBox);


  let renderer: WebGLRenderer = scene.renderer;

  let directionLight: DirectionLight = new DirectionLight();
  directionLight.color = new Color(1, 1, 1);
  directionLight.direction = new Vector3(0, -1, 0);
  scene.addChild(directionLight);

  let ambientLigt: AmbientLight = new AmbientLight();
  ambientLigt.color = new Color(1, 1, 1);
  ambientLigt.amount = 0.5;
  scene.addChild(ambientLigt);


  window.onresize = function () {
    camera.aspect = innerWidth / innerHeight;
    scene.resize(innerWidth, innerHeight);
  }

  let ticker: Ticker = new Ticker(60);
  ticker.addTick(scene);

  ['init', 'initFailed'].forEach(function (eventName) {
    scene.renderer.on(eventName, function (e) {
      console.log(e.type, e);
    });
  });

  let gl: WebGLRenderingContext;
  setTimeout(function () {
    ticker.start(true);
    gl = renderer.gl;
  }, 10);


}

window.onload = function () {
  test();
}

