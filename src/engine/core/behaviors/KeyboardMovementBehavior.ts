import { IBehaviorData } from "./IBehaviorData";
import { IBehaviorBuilder } from "./IBehaviorBuilder";
import { IBehavior } from "./IBehavior";
import { BaseBehavior } from "./BaseBehavior";
import { InputManager } from "../input/InputManager";
import { BehaviorManager } from "./BehaviorManager";
import { KEY_CODE_MACRO } from "../define/Macro";


export class KeyboardMovementBehaviorData implements IBehaviorData {

  
    public name: string;

    public speed: number = 0.1;

    public setFromJson(json: any): void {
        if (json.name === undefined) {
            throw new Error("Name must be defined in behavior data.");
        }

        this.name = String(json.name);

        if (json.speed !== undefined) {
            this.speed = Number(json.speed);
        }
    }
}


export class KeyboardMovementBehaviorBuilder implements IBehaviorBuilder {

   
    public get type(): string {
        return "keyboardMovement";
    }

    public buildFromJson(json: any): IBehavior {
        let data = new KeyboardMovementBehaviorData();
        data.setFromJson(json);
        return new KeyboardMovementBehavior(data);
    }
}


export class KeyboardMovementBehavior extends BaseBehavior {

  
    public speed: number = 0.1;

 
    public constructor(data: KeyboardMovementBehaviorData) {
        super(data);

        this.speed = data.speed;
    }

  
    public update(time: number): void {
        if (InputManager.isKeyDown(KEY_CODE_MACRO.left)) {
            this._owner.transform.position.x -= this.speed;
        }
        if (InputManager.isKeyDown(KEY_CODE_MACRO.right)) {
            this._owner.transform.position.x += this.speed;
        }
        if (InputManager.isKeyDown(KEY_CODE_MACRO.up)) {
            this._owner.transform.position.y -= this.speed;
        }
        if (InputManager.isKeyDown(KEY_CODE_MACRO.down)) {
            this._owner.transform.position.y += this.speed;
        }

        super.update(time);
    }
}

