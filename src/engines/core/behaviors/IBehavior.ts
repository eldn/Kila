import { TEntity } from "../world/Entity";

export interface IBehavior {

    name: string;

  
    setOwner(owner: TEntity): void;

    updateReady(): void;

    update(time: number): void;

    
    apply(userData: any): void;
}