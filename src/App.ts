import { Engine } from "./Engine/Core/Engine";


let engine : Engine;

window.onload = function(){
    engine = new Engine(800, 600);
    engine.start();
}

window.onresize = function(){
    engine.resize();
}

document.addEventListener("visibilitychange", ()=>{
    if (document.visibilityState === 'visible') {
        engine.stop();
      } else {
        engine.start();
      }
});