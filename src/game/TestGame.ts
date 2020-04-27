import { CoreEngine } from "../engine/core/CoreEngine";


let engine: CoreEngine;

window.onload = function () {
  engine = new CoreEngine(640, 480);
  engine.start("viewport");
}

window.onresize = function () {
  engine.resize();
}