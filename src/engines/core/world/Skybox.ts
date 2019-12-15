import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";
import { TEntity } from "./Entity";
import { SceneGraph } from "./SceneGraph";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/AssetManager";
import { ImageAsset } from "../assets/ImageAssetLoader";
import { Message } from "../message/Message";
import { IMessageHandler } from "../message/IMessageHandler";
import { gl } from "../gl/GLUtilities";
import { GLBuffer } from "../gl/GLBuffer";
import { AttributeInfo } from "../gl/AttributeInfo";
import { SkyBoxShader } from "../gl/shaders/SkyBoxShader";

export class SkyBox extends TEntity implements IMessageHandler {


    private _isLoad: boolean = false;
    private cubeTextures: string[] = [];
    private waitLoadMsg : string[] = [];
    private _cubTexture : WebGLTexture;
    private _skyboxVerticesBuffer : GLBuffer;
    private _shader : SkyBoxShader;
    constructor(name: string, sceneGrapa: SceneGraph, mapTextures: string[]) {
        super(name, sceneGrapa)
        this.cubeTextures = mapTextures;
    }


    public load(): void {

        super.load();


        for (let i: number = 0; i < this.cubeTextures.length; ++i) {
            let textureName : string = this.cubeTextures[i];
            let asset = AssetManager.getAsset(textureName) as ImageAsset;
            if (asset !== undefined) {
                this.loadTextureFromAsset(asset);
            } else {
                let loadMsg : string = MESSAGE_ASSET_LOADER_ASSET_LOADED + textureName;
                this.waitLoadMsg.push(loadMsg);
                Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + textureName, this);
            }
        }

    }


    public onMessage(message: Message): void {
        let msgIndex : number = this.waitLoadMsg.indexOf(message.code);
        if(msgIndex != -1){
            this.waitLoadMsg.splice(msgIndex, 1);
            this.loadTextureFromAsset(message.context as ImageAsset);
        }
    }


    private _loadCount = 0;
    private loadTextureFromAsset(asset: ImageAsset): void {

        this._loadCount ++;


        if(this._loadCount >= this.cubeTextures.length){

            this._cubTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._cubTexture);


            let targets : number[] = [
                gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
            ];

            for(let i : number = 0; i < this.cubeTextures.length; ++i){

                
                // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, 2048, 2048, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
                let textureName : string = this.cubeTextures[i];
                let asset = AssetManager.getAsset(textureName) as ImageAsset;

                gl.texImage2D(targets[i], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.data);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            

                if(!asset){
                    console.error("texture not load yet");
                }
            }
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);



            let skyboxVertices : number[] = [
                // Positions          
                -1.0,  1.0, -1.0,
                -1.0, -1.0, -1.0,
                 1.0, -1.0, -1.0,
                 1.0, -1.0, -1.0,
                 1.0,  1.0, -1.0,
                -1.0,  1.0, -1.0,
          
                -1.0, -1.0,  1.0,
                -1.0, -1.0, -1.0,
                -1.0,  1.0, -1.0,
                -1.0,  1.0, -1.0,
                -1.0,  1.0,  1.0,
                -1.0, -1.0,  1.0,
          
                 1.0, -1.0, -1.0,
                 1.0, -1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0, -1.0,
                 1.0, -1.0, -1.0,
           
                -1.0, -1.0,  1.0,
                -1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0, -1.0,  1.0,
                -1.0, -1.0,  1.0,
          
                -1.0,  1.0, -1.0,
                 1.0,  1.0, -1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0,  1.0, -1.0,
          
                -1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0,
                 1.0, -1.0, -1.0,
                 1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0,
                 1.0, -1.0,  1.0
            ];

            this._skyboxVerticesBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);

            // 顶点数据
            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            this._skyboxVerticesBuffer.addAttributeLocation(positionAttribute);

            this._skyboxVerticesBuffer.setData(skyboxVertices);
            this._skyboxVerticesBuffer.upload();
            this._skyboxVerticesBuffer.unbind();


            this._shader = new SkyBoxShader();

            this._isLoad = true;
        }

    }


    public render(shader: Shader, projection: Matrix4x4, viewMatrix: Matrix4x4): void {

        if(!this._isLoad){
            return;
        }
    
        
        this._shader.use();

        gl.depthMask(false);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._cubTexture);
        this._shader.setUniform1i("skybox", 0);

        // 我们只关心方向所以清除移动的部分
        let viewDirectionMatrix : Matrix4x4 = Matrix4x4.identity();
        viewDirectionMatrix.copyFrom(viewMatrix);
        viewDirectionMatrix.data[12] = 0;
        viewDirectionMatrix.data[13] = 0;
        viewDirectionMatrix.data[14] = 0;


        this._shader.setUniformMatrix4fv("projection", false, projection.toFloat32Array());
        this._shader.setUniformMatrix4fv("view", false, viewDirectionMatrix.toFloat32Array());


        this._skyboxVerticesBuffer.bind();
        this._skyboxVerticesBuffer.draw();

        gl.depthMask(true);
    }

    public getCubeTexture() : WebGLTexture{
        return this._cubTexture;
    }




}