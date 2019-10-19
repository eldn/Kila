import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./BaseComponent";
import { Shader } from "../gl/shaders/Shader";
import Mesh from "../assets/ObjLoader/mesh";

export class MeshRendererCoponentData implements IComponentData {
    public name: string;

    public mesh : Mesh;

    public setFromJson(json: any): void {
        
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.mesh !== undefined) {
            // this.mesh.setFromJson(json.mesh);
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

      
        // this._mesh = new Sprite(name, data.materialName, this._width, this._height);
    }

    public load(): void {
        // this._sprite.load();
    }


    public render(shader: Shader): void {
        // this._sprite.draw(shader, this.owner.worldMatrix);

        super.render(shader);
    }
}


