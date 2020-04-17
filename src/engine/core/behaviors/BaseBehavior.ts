import { IBehavior } from "./IBehavior";
import { GameObject } from "../world/GameObject";
import { IBehaviorData } from "./IBehaviorData";

export abstract class BaseBehavior implements IBehavior {
    public name: string;

 
    protected _data: IBehaviorData;


    protected _owner: GameObject;

    public constructor(data: IBehaviorData) {
        this._data = data;
        this.name = this._data.name;
    }

    public setOwner(owner: GameObject): void {
        this._owner = owner;
    }

 
    public updateReady(): void {
    }

  
    public update(time: number): void {
    }

 
    public apply(userData: any): void {
    }
}