import { GameObject } from "../world/GameObject";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";


export interface IComponent {
    name: string;
    readonly owner: GameObject;
    setOwner(owner: GameObject): void;
    updateReady(): void;
    load(): void;
    update(time: number): void;
    render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void;
}
