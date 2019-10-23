import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./BaseComponent";
import { Shader } from "../gl/shaders/Shader";
import { Mesh } from "../graphics/Mesh";
import { Matrix4x4 } from "../math/Matrix4x4";

export class MeshRendererCoponentData implements IComponentData {
    public name: string;

    /**
     * 模型路径
     */
    public modelPath : string;


    /**
     * 材质路径
     */
    public mtlPath : string;

    /**
     * 材质名
     * TODO: 材质应该读取模型文件数据中的
     */
    public materialName : string;

    public setFromJson(json: any): void {
        
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.modelPath !== undefined) {
            this.modelPath = String(json.modelPath);
        }

        if (json.mtlPath !== undefined) {
            this.mtlPath = String(json.mtlPath);
        }

        if (json.materialName !== undefined) {
            this.materialName = String(json.materialName);
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

        this._mesh = new Mesh(data.name, data.modelPath, data.mtlPath, data.materialName);
    }

    public load(): void {
        this._mesh.load();
    }

    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        this._mesh.draw(shader, this.owner.worldMatrix, projection, viewMatrix);
        super.render(shader, projection, viewMatrix);
    }
}


