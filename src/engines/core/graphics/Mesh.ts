import { AttributeInfo } from "../gl/AttributeInfo";
import { gl } from "../gl/GLUtilities";
import { GLBuffer } from "../gl/GLBuffer";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/AssetManager";
import { ModelAsset } from "../assets/ModelAssetLoader";
import { Message } from "../message/Message";
import { IMessageHandler } from "../message/IMessageHandler";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { MeshMaterial } from "../material/MeshMaterial";
import { MaterialManager } from "../material/MaterialManager";
import { OBJDoc, DrawingInfo } from "../utils/OBJDoc";


export class Mesh implements IMessageHandler{

    private _name : string;
    private _modelPath : string;
    private _mtlPath : string;
    private _vertextBuffer : GLBuffer;
    private _indexBuffer : GLBuffer;
    private _isLoaded: boolean = false;
    protected _origin: Vector3 = Vector3.zero;
    protected _materialName: string;
    protected _material: MeshMaterial;
    private _meshAsset : ModelAsset;
    private _mtlAsset : ModelAsset;

    constructor(name : string, modelPath : string, mtlPath : string, materialName: string){
        this._name = name;
        this._modelPath = modelPath;
        this._mtlPath = mtlPath;
        this._materialName = materialName;
        this._vertextBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._indexBuffer = new GLBuffer(gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER, gl.TRIANGLES);
        
        let meshAsset = AssetManager.getAsset(this._modelPath) as ModelAsset;
        if (meshAsset === undefined) {
            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._modelPath, this);
        } else {
            this._meshAsset = meshAsset;
        }

        let mtlAsset = AssetManager.getAsset(this._mtlPath) as ModelAsset;
        if (mtlAsset === undefined) {
            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._mtlPath, this);
        } else {
            this._mtlAsset = mtlAsset;
        }

        if(this._meshAsset && this._mtlAsset){
            this.loadMeshFromAsset(this._meshAsset, this._mtlAsset);
        }

        this._material = MaterialManager.getMaterial(this._materialName) as MeshMaterial;
    }

    public get name(): string {
        return this._name;
    }

    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    public onMessage(message: Message): void {

        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._modelPath) {
            this._meshAsset = message.context;
            
        } else if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._mtlPath) {
            this._mtlAsset = message.context;
        }

        if(this._meshAsset && this._mtlAsset){
            this.loadMeshFromAsset(this._meshAsset, this._mtlAsset);
        }
    }

    private loadMeshFromAsset(meshAsset: ModelAsset, mtlAsset : ModelAsset) :  void{

        let objDoc : OBJDoc = new OBJDoc(meshAsset.data, mtlAsset.data);
        objDoc.parse(1, true);
        let drawInfo : DrawingInfo = objDoc.getDrawingInfo();

        let vertices : Array<number> = drawInfo.vertices;
        let indices : Array<number> = drawInfo.indices;

        let uvs : Array<number> = drawInfo.uvs;
        let normals : Array<number> = drawInfo.normals;
        let colors : Array<number> = drawInfo.colors;
        

        // 合并color,uv,normal 到定点数据
        let uvP : number = 0;
        let colorP : number = 0;
        let normalP : number = 0;
        let i : number = 3;
        while(i < vertices.length){

            // uv
            vertices.splice(i, 0, uvs[uvP], uvs[uvP + 1]);
            uvP += 2;
            i += 2;

            // color
            vertices.splice(i, 0, colors[colorP], colors[colorP + 1], colors[colorP + 2], colors[colorP + 3]);
            colorP += 4;
            i += 4;

            // normal
            vertices.splice(i, 0, normals[normalP], normals[normalP + 1], normals[normalP + 2]);
            normalP += 3;
            i += 3;

            // skip follow vertex
            i += 3;
        }

        

        // 顶点数据
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.size = 3;
        this._vertextBuffer.addAttributeLocation(positionAttribute);

        // UV数据
        let textCoordAttribute = new AttributeInfo();
        textCoordAttribute.location = 1;
        textCoordAttribute.size = 2;
        this._vertextBuffer.addAttributeLocation(textCoordAttribute);

        // color数据
        let colorAttribute = new AttributeInfo();
        colorAttribute.location = 2;
        colorAttribute.size = 4;
        this._vertextBuffer.addAttributeLocation(colorAttribute);

        // 法线数据
        let normalAttribute = new AttributeInfo();
        normalAttribute.location = 3;
        normalAttribute.size = 3;
        this._vertextBuffer.addAttributeLocation(normalAttribute);

        this._vertextBuffer.setData(vertices);
        this._vertextBuffer.upload();
        this._vertextBuffer.unbind();

        // 顶点索引数据
        this._indexBuffer.setData(indices);
        this._indexBuffer.upload();
        this._indexBuffer.unbind();


        this._isLoaded = true;
    }


    public load() :void{


    }


    public draw(shader: Shader, model: Matrix4x4, projection : Matrix4x4, viewMatrix : Matrix4x4) :void{

        this._material.shader.use();

        this._material.shader.setUniformMatrix4fv("u_projection", false, projection.toFloat32Array());
        this._material.shader.setUniformMatrix4fv("u_view", false, viewMatrix.toFloat32Array());

        this._material.shader.setUniformMatrix4fv("u_model", false, model.toFloat32Array());
        this._material.shader.setUniform4fv("u_tint", this._material.tint.toFloat32Array());

        if (this._material.diffuseTexture !== undefined) {
            this._material.diffuseTexture.activateAndBind(0);
            this._material.shader.setUniform1i("u_diffuse", 0);
        }


        this._vertextBuffer.bind();
        this._indexBuffer.bind();
        this._indexBuffer.draw();
    }
}