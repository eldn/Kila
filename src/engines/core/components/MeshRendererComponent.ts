import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./BaseComponent";
import { Shader } from "../gl/shaders/Shader";
import { Mesh } from "../graphics/Mesh";

export class MeshRendererCoponentData implements IComponentData {
    public name: string;
    public path : string;

    public setFromJson(json: any): void {
        
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.path !== undefined) {
            this.path = String(json.path);
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
    }

    public load(): void {
        this._mesh.load();
    }

    public render(shader: Shader): void {
        this._mesh.draw(shader, this.owner.worldMatrix);
        super.render(shader);
    }
}


