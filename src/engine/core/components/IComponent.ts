import { GameObject } from "../world/GameObject";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4 } from "../math/Matrix4";


export interface IComponent {
    readonly owner: GameObject;
    setOwner(owner: GameObject): void;
    updateReady(): void;
    load(): void;
    update(time: number): void;
    render(shader: Shader, projection : Matrix4, viewMatrix : Matrix4): void;
}
