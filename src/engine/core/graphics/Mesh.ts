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


export class Mesh implements IMessageHandler{

    private _name : string;
    private _path : string;
    private _vertextBuffer : GLBuffer;
    private _indexBuffer : GLBuffer;
    private _isLoaded: boolean = false;
    protected _origin: Vector3 = Vector3.zero;

    constructor(name : string, path : string){
        this._name = name;
        this._path = path;
        this._vertextBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._indexBuffer = new GLBuffer(gl.FLOAT, gl.ELEMENT_ARRAY_BUFFER, gl.TRIANGLES);
        
        let asset = AssetManager.getAsset(this._name) as MeshAsset;
        if (asset !== undefined) {
            this.loadMeshFromAsset(asset);
        } else {
            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this);
        }
    }

    public get name(): string {
        return this._name;
    }

    public get isLoaded(): boolean {
        return this._isLoaded;
    }

     /** The origin location of this sprite. */
     public get origin(): Vector3 {
        return this._origin;
    }

    /** The name of this sprite. */
    public set origin(value: Vector3) {
        this._origin = value;
        // TODO重新计算坐标
    }

    public onMessage(message: Message): void {
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name) {
            this.loadMeshFromAsset(message.context as MeshAsset);
        }
    }

    private  loadMeshFromAsset(asset: MeshAsset) :  void{
        this._isLoaded = true;
    }


    public load() :void{
        // this.addVertices()
    }


    public addVertices(vertices : Array<Vertex>, indices : Array<number>) : void{

        // 处理顶点数据
        // let positionAttribute = new AttributeInfo();
        // positionAttribute.location = 0;
        // positionAttribute.size = 3;
        // this._vertextBuffer.addAttributeLocation(positionAttribute);

        // let texCoordAttribute = new AttributeInfo();
        // texCoordAttribute.location = 1;
        // texCoordAttribute.size = 2;
        // this._vertextBuffer.addAttributeLocation(texCoordAttribute);


        // for (let v of vertices) {
        //     let data : Array<number> = v.toArray();
        //     this._vertextBuffer.pushBackData(data);
        // }

        // TODO测试只使用position
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.size = 3;
        this._vertextBuffer.addAttributeLocation(positionAttribute);


        for (let v of vertices) {
            let data : Array<number> = v.position.toArray();
            this._vertextBuffer.pushBackData(data);
        }

        this._vertextBuffer.upload();
        this._vertextBuffer.unbind();

        // 处理定点索引数据
        this._indexBuffer.pushBackData(indices);
        this._indexBuffer.upload();
        this._indexBuffer.unbind();
    }


    public draw(shader: Shader, model: Matrix4x4) :void{

        shader.setUniformMatrix4fv("u_model", false, model.toFloat32Array());
        // shader.setUniform4fv("u_tint", this._material.tint.toFloat32Array());

        // if (this._material.diffuseTexture !== undefined) {
        //     this._material.diffuseTexture.activateAndBind(0);
        //     shader.setUniform1i("u_diffuse", 0);
        // }


        this._vertextBuffer.bind();
        this._indexBuffer.bind();
        this._indexBuffer.draw();
    }
}