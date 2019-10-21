import { IGame } from "./game/IGame";
import { LevelManager } from "./engines/core/world/LevelManager";
import { Shader } from "./engines/core/gl/shaders/Shader";
import { Engine } from "./engines/core/Engine";



class TestGame implements IGame {

  updateReady(): void {
    // Load the test level. This should be configurable.
    LevelManager.changeLevel("test 1");
  }

  update(time: number): void {
  }

  render(shader: Shader): void {

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