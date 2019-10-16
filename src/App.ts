import { Engine } from "./Engine/Core/Engine";
import { IGame } from "./game/IGame";
import { LevelManager } from "./Engine/Core/world/LevelManager";
import { Shader } from "./Engine/Core/gl/shaders/Shader";


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