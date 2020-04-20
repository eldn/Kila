import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./BaseComponent";
import { Shader } from "../gl/shaders/Shader";
import { Mesh } from "../graphics/Mesh";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Material } from "../renderering/Material";
import { Texture } from "../graphics/Texture";
import { gl } from "../gl/GLUtilities";
import { Color } from "../graphics/Color";

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
        // let data = new MeshRendererCoponentData();
        // data.setFromJson(json);
        // return new MeshRendererComponent(data);
        return null;
    }
}


export class MeshRendererComponent extends BaseComponent {

    private _mesh: Mesh;
    private _material : Material;

    // test texture
    private _testTexture : Texture;

    public constructor(mesh : Mesh, material : Material) {
        super();
        this._mesh = mesh;
        this._material = material;
        this._testTexture = new Texture("assets/textures/cubetexture.png");
    }


    public load(): void {
        this._mesh.load();
        this._material.load();
    }

    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        if(this._mesh.isLoaded && this._material.isLoaded){

            // material
            if(this._testTexture.isLoaded){
                this._testTexture.activateAndBind();

                let u_diffuse = shader.getUniformLocation("u_diffuse");
                gl.uniform1i(u_diffuse, 0);

                let u_tint = shader.getUniformLocation("u_tint");
                gl.uniform4fv(u_tint, new Color(1.0, 1.0, 1.0, 1.0).toFloat32Array());
            }

            // mesh
            this._mesh.draw(shader, this.owner.worldMatrix, projection, viewMatrix);
            super.render(shader, projection, viewMatrix);
        }
    }
}


