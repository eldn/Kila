import { TEntity } from "../world/Entity";
import { Shader } from "../gl/shaders/Shader";


export interface IComponent {
    name: string;
    readonly owner: TEntity;
    setOwner(owner: TEntity): void;
    updateReady(): void;
    load(): void;
    update(time: number): void;
    render(shader: Shader): void;
}
