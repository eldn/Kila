import { Vector3 } from "../engine/math/Vector3";

export class TestGame{

  constructor(){

    let v3 : Vector3 = new Vector3(1, 2, 3);
    let v2 : Vector3 = v3.add(new Vector3(1,1, 1));
    console.log(v2);
    console.log(v3);
  }
}

let game = new TestGame();