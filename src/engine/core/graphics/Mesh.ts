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
import { Scene } from "../world/Scene";
import { SceneManager } from "../world/SceneManager";
import { GameObject } from "../world/GameObject";
import { PerspectiveCamera } from "../world/cameras/PerspectiveCamera";
import { PointLightProperty, PointLight } from "../world/lights/PointLight";
import { LightRendererComponent } from "../components/LightComponent";
import { Light, LightType } from "../world/lights/Light";
import { DirectionLight } from "../world/lights/DirectionLight";
import { MeshShader } from "../gl/shaders/MeshShader";
import { SpotLight } from "../world/lights/Spotlight";
import { NoLightShader } from "../gl/shaders/NoLightShader";
import { EvnMapShader } from "../gl/shaders/EnvMapShader";

let v3_a: Vector3 = new Vector3();

export class Mesh implements IMessageHandler {

    private _name: string;
    private _modelPath: string;
    private _mtlPath: string;
    private _vertextBuffer: GLBuffer;
    private _uvBuffer: GLBuffer;
    private _normalBuffer: GLBuffer;
    private _indexBuffer: GLBuffer;
    private _isLoaded: boolean = false;
    protected _origin: Vector3 = Vector3.zero;
    protected _materialName: string;
    protected _material: MeshMaterial;
    private _meshAsset: ModelAsset;
    private _mtlAsset: ModelAsset;

    constructor(name: string, modelPath: string, mtlPath: string, materialName: string) {
        this._name = name;
        this._modelPath = modelPath;
        this._mtlPath = mtlPath;
        this._materialName = materialName;
        this._vertextBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._uvBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._normalBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
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

        if (this._meshAsset && this._mtlAsset) {
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

        if (this._isLoaded) {
            return;
        }

        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._modelPath) {
            this._meshAsset = message.context;

        } else if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._mtlPath) {
            this._mtlAsset = message.context;
        }

        if (this._meshAsset && this._mtlAsset) {
            this.loadMeshFromAsset(this._meshAsset, this._mtlAsset);
        }
    }

    private loadMeshFromAsset(meshAsset: ModelAsset, mtlAsset: ModelAsset): void {

        const vertices = [
            // Front face, 
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            // Back face 
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            // Top face 
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,
            // Bottom face 
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,
            // Right face 
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            // Left face 
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];



        // 顶点数据
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.size = 3;
        this._vertextBuffer.addAttributeLocation(positionAttribute);


        this._vertextBuffer.setData(vertices);
        this._vertextBuffer.upload();
        this._vertextBuffer.unbind();



        const textCoord = [

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

        ];


        // UV数据
        let textCoordAttribute = new AttributeInfo();
        textCoordAttribute.location = 1;
        textCoordAttribute.size = 2;
        this._uvBuffer.addAttributeLocation(textCoordAttribute);

        this._uvBuffer.setData(textCoord);
        this._uvBuffer.upload();
        this._uvBuffer.unbind();



        const normals = [

            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,


        ]



        // 法线数据
        let normalAttribute = new AttributeInfo();
        normalAttribute.location = 2;
        normalAttribute.size = 3;
        this._normalBuffer.addAttributeLocation(normalAttribute);



        this._normalBuffer.setData(normals);
        this._normalBuffer.upload();
        this._normalBuffer.unbind();


        const indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];



        // 顶点索引数据
        this._indexBuffer.setData(indices);
        this._indexBuffer.upload();
        this._indexBuffer.unbind();


        this._isLoaded = true;
    }


    public load(): void {


    }


    public draw(shader: Shader, model: Matrix4x4, projection: Matrix4x4, viewMatrix: Matrix4x4): void {

        this._vertextBuffer.bind();
        this._uvBuffer.bind();
        this._normalBuffer.bind();
        this._indexBuffer.bind();
        this._indexBuffer.draw();
    }

    public radians(degrees: number): number {
        return degrees * (Math.PI / 180.0);
    }
}