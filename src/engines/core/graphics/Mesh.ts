import { AttributeInfo } from "../gl/AttributeInfo";
import { gl } from "../gl/GLUtilities";
import { Vertex } from "./Vertex";
import { GLBuffer } from "../gl/GLBuffer";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/AssetManager";
import { MeshAsset } from "../assets/MeshAssetLoader";
import { Message } from "../message/Message";
import { IMessageHandler } from "../message/IMessageHandler";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { MeshMaterial } from "../material/MeshMaterial";
import { MaterialManager } from "../material/MaterialManager";


export class Mesh implements IMessageHandler{

    private _name : string;
    private _path : string;
    private _vertextBuffer : GLBuffer;
    private _indexBuffer : GLBuffer;
    private _isLoaded: boolean = false;
    protected _origin: Vector3 = Vector3.zero;
    protected _materialName: string;
    protected _material: MeshMaterial;

    private _vertex : Array<Vertex> = [];
    private _indices : Array<number> = [];

    constructor(name : string, path : string, materialName: string){
        this._name = name;
        this._path = path;
        this._materialName = materialName;
        this._vertextBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._indexBuffer = new GLBuffer(gl.UNSIGNED_BYTE, gl.ELEMENT_ARRAY_BUFFER, gl.TRIANGLES);
        
        let asset = AssetManager.getAsset(this._path) as MeshAsset;
        if (asset !== undefined) {
            this.loadMeshFromAsset(asset);
        } else {
            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._path, this);
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
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._path) {
            this.loadMeshFromAsset(message.context as MeshAsset);
        }
    }

    private loadMeshFromAsset(asset: MeshAsset) :  void{
        this._isLoaded = true;
    }


    public load() :void{

        // TODO 测试数据

        let verticesColors = [
            1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
            -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
            -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
            1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
            1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
            1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
            -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
            -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black  
        ];

        let indices = [
            0, 1, 2,   0, 2, 3,    // 前
            0, 3, 4,   0, 4, 5,    // 右
            0, 5, 6,   0, 6, 1,    // 上
            1, 6, 7,   1, 7, 2,    // 左
            7, 4, 3,   7, 3, 2,    // 下
            4, 7, 6,   4, 6, 5     // 后
        ];

        this.addVertices(verticesColors, indices);
    }


    public addVertices(vertices : Array<number>, indices : Array<number>) : void{
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.size = 3;
        this._vertextBuffer.addAttributeLocation(positionAttribute);

        let colorAttribute = new AttributeInfo();
        colorAttribute.location = 1;
        colorAttribute.size = 3;
        this._vertextBuffer.addAttributeLocation(colorAttribute);

        this._vertextBuffer.setData(vertices);
        this._vertextBuffer.upload();
        this._vertextBuffer.unbind();

        // 处理定点索引数据
        this._indexBuffer.pushBackData(indices);
        this._indexBuffer.upload();
        this._indexBuffer.unbind();
    }


    public draw(shader: Shader, model: Matrix4x4, projection : Matrix4x4, viewMatrix : Matrix4x4) :void{

        this._material.shader.use();

        this._material.shader.setUniformMatrix4fv("u_projection", false, projection.toFloat32Array());
        this._material.shader.setUniformMatrix4fv("u_view", false, viewMatrix.toFloat32Array());

        this._material.shader.setUniformMatrix4fv("u_model", false, model.toFloat32Array());


        this._vertextBuffer.bind();
        this._indexBuffer.bind();
        this._indexBuffer.draw();
    }
}