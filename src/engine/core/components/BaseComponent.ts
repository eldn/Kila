import { IComponent } from "./IComponent";
import { TEntity } from "../world/Entity";
import { IComponentData } from "./IComponentData";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";


export abstract class BaseComponent implements IComponent {

    /** The owning entity. */
    protected _owner: TEntity;
    protected _data: IComponentData;
    public name: string;

    public constructor(data: IComponentData) {
        this._data = data;
        this.name = data.name;
    }

    public get owner(): TEntity {
        return this._owner;
    }

    public setOwner(owner: TEntity): void {
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
