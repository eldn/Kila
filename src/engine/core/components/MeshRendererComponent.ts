import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./BaseComponent";
import { Shader } from "../gl/shaders/Shader";
import { Mesh } from "../graphics/Mesh";
import { Vector3 } from "../math/Vector3";

export class MeshRendererCoponentData implements IComponentData {
    public name: string;
    public path : string;
    public origin: Vector3 = Vector3.zero;

    public setFromJson(json: any): void {
        
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.mesh !== undefined) {
            this.path = String(json.path);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJson(json.origin);
        }
    }
}


export class MeshRendererComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return "mesh";
    }

    public buildFromJson(json: any): IComponent {
        let data = new MeshRendererCoponentData();
        data.setFromJson(json);
        return new MeshRendererComponent(data);
    }
}


export class MeshRendererComponent extends BaseComponent {

    private _mesh: Mesh;

    public constructor(data: MeshRendererCoponentData) {
        super(data);

        this._mesh = new Mesh(data.name, data.path);
        if (!data.origin.equals(Vector3.zero)) {
            this._mesh.origin.copyFrom(data.origin);
        }
    }

    public load(): void {
        this._mesh.load();
    }

    public render(shader: Shader): void {
        this._mesh.draw(shader, this.owner.worldMatrix);
        super.render(shader);
    }
}


