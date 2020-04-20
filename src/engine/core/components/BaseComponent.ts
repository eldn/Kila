import { IComponent } from "./IComponent";
import { GameObject } from "../world/GameObject";
import { IComponentData } from "./IComponentData";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";


export abstract class BaseComponent implements IComponent {

    /** The owning entity. */
    protected _owner: GameObject;

    public get owner(): GameObject {
        return this._owner;
    }

    public setOwner(owner: GameObject): void {
        this._owner = owner;
    }

    public load(): void {
    }

    public updateReady(): void {
    }

    public update(time: number): void {
    }

    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
    }
}
