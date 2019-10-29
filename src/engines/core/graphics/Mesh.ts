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
import { Level } from "../world/Level";
import { LevelManager } from "../world/LevelManager";
import { TEntity } from "../world/Entity";
import { PerspectiveCamera } from "../world/cameras/PerspectiveCamera";

const v3_a: Vector3 = new Vector3();

class iLightProperty {
    position: Vector3 = new Vector3()
    ambient: Vector3 = new Vector3();
    diffuse: Vector3 = new Vector3();
    specular: Vector3 = new Vector3();

    constructor(position: Vector3, ambient: Vector3, diffuse: Vector3, specular: Vector3) {
        this.position.copyFrom(position);
        this.ambient.copyFrom(ambient);
        this.diffuse.copyFrom(diffuse);
        this.specular.copyFrom(specular);
    }
}

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
    private _lightProperty: iLightProperty;

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
        // let colors : Array<number> = drawInfo.colors;
        

        // 合并color,uv,normal 到定点数据
        let uvP : number = 0;
        // let colorP : number = 0;
        let normalP : number = 0;
        let i : number = 3;
        while(i < vertices.length){

            // uv
            vertices.splice(i, 0, uvs[uvP], uvs[uvP + 1]);
            uvP += 2;
            i += 2;

            // color
            // vertices.splice(i, 0, colors[colorP], colors[colorP + 1], colors[colorP + 2], colors[colorP + 3]);
            // colorP += 4;
            // i += 4;

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
        // let colorAttribute = new AttributeInfo();
        // colorAttribute.location = 2;
        // colorAttribute.size = 4;
        // this._vertextBuffer.addAttributeLocation(colorAttribute);

        // 法线数据
        let normalAttribute = new AttributeInfo();
        normalAttribute.location = 2;
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

        let curLevel: Level = LevelManager.activeLevel;
        if (curLevel) {
            let light: TEntity = curLevel.sceneGraph.getEntityByName('testLight');
            if (light) {
                let lightWorldPos: Vector3 = light.getWorldPosition();

                if (!this._lightProperty) {
                    this._lightProperty = new iLightProperty(lightWorldPos, new Vector3(0.2, 0.2, 0.2), new Vector3(0.5, 0.5, 0.5), new Vector3(1.0, 1.0, 1.0));
                }

                // 设置光的位置和属性
                this._material.shader.setUniform3f("u_light.position", this._lightProperty.position.x, this._lightProperty.position.y, this._lightProperty.position.z);
                this._material.shader.setUniform3f("u_light.ambient", this._lightProperty.ambient.x, this._lightProperty.ambient.y, this._lightProperty.ambient.z);

                // 将光照调暗了一些以搭配场景
                this._material.shader.setUniform3f("u_light.diffuse", this._lightProperty.diffuse.x, this._lightProperty.diffuse.y, this._lightProperty.diffuse.z);
                this._material.shader.setUniform3f("u_light.specular", this._lightProperty.specular.x, this._lightProperty.specular.y, this._lightProperty.specular.z);
            }
        }

        // 设置观察点（摄像机）的位置，用于计算镜面反射 
        let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera as PerspectiveCamera;
        if (activeCamera) {
            let viewPos: Vector3 = activeCamera.getWorldPosition();
            this._material.shader.setUniform3f("u_viewPos", viewPos.x, viewPos.y, viewPos.z);
        }

        this._material.shader.setUniformMatrix4fv("u_projection", false, projection.toFloat32Array());
        this._material.shader.setUniformMatrix4fv("u_view", false, viewMatrix.toFloat32Array());
        this._material.shader.setUniformMatrix4fv("u_model", false, model.toFloat32Array());

        // 设置材质
        this._material.shader.setUniform1f("u_material.shininess", 64.0);
        if (this._material.diffuseTexture !== undefined) {
            this._material.diffuseTexture.activateAndBind(0);
            this._material.shader.setUniform1i("u_material.diffuse", 0);
        }
        if (this._material.specularTexture !== undefined) {
            this._material.specularTexture.activateAndBind(1);
            this._material.shader.setUniform1i("u_material.specular", 1);
        }


        this._vertextBuffer.bind();
        this._indexBuffer.bind();
        this._indexBuffer.draw();
    }
}