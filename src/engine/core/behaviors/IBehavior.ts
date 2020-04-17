import { GameObject } from "../world/GameObject";

export interface IBehavior {

    name: string;

  
    setOwner(owner: GameObject): void;

    updateReady(): void;

    update(time: number): void;

    
    apply(userData: any): void;
}