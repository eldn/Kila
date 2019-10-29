import { GemometryShader } from "../../gl/shaders/GeometryShader";
import { GLBuffer } from "../../gl/GLBuffer";
import { Color } from "../Color";
import { gl } from "../../gl/GLUtilities";
import { AttributeInfo } from "../../gl/AttributeInfo";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { Level } from "../../world/Level";
import { LevelManager } from "../../world/LevelManager";
import { TEntity } from "../../world/Entity";
import { Vector3 } from "../../math/Vector3";
import { PerspectiveCamera } from "../../world/cameras/PerspectiveCamera";

export class Cube{

    private _name : string;;
    private _vertextBuffer : GLBuffer;
    private _shader: GemometryShader;
    public get shader(): GemometryShader {
        return this._shader;
    }
    public set shader(value: GemometryShader) {
        this._shader = value;
    }
    private _color : Color;

    constructor(name : string, color : Color){
        this._name = name;
        this._color = color;
        this._vertextBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._shader = new GemometryShader();
    }

    public get name(): string {
        return this._name;
    }


    public load() :void{

         

         let vertices : Array<number> = [
            -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
            0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 
            0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 
            0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 
           -0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 
           -0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 
       
           -0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
            0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
            0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
            0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
           -0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
           -0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
       
           -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
           -0.5,  0.5, -0.5, -1.0,  0.0,  0.0,
           -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
           -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
           -0.5, -0.5,  0.5, -1.0,  0.0,  0.0,
           -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
       
            0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
            0.5,  0.5, -0.5,  1.0,  0.0,  0.0,
            0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
            0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
            0.5, -0.5,  0.5,  1.0,  0.0,  0.0,
            0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
       
           -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
            0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
            0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
            0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
           -0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
           -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
       
           -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
            0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
            0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
            0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
           -0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
           -0.5,  0.5, -0.5,  0.0,  1.0,  0.0
         ];

         // 顶点数据
         let positionAttribute = new AttributeInfo();
         positionAttribute.location = 0;
         positionAttribute.size = 3;
         this._vertextBuffer.addAttributeLocation(positionAttribute);

         // 法线数据
         let normalAttribute = new AttributeInfo();
         normalAttribute.location = 1;
         normalAttribute.size = 3;
         this._vertextBuffer.addAttributeLocation(normalAttribute);
 
         this._vertextBuffer.setData(vertices);
         this._vertextBuffer.upload();
         this._vertextBuffer.unbind();
    }


    public draw(shader: Shader, model: Matrix4x4, projection : Matrix4x4, viewMatrix : Matrix4x4) :void{

        this._shader.use();

        let curLevel: Level = LevelManager.activeLevel;

        if (curLevel) {
          let light : TEntity = curLevel.sceneGraph.getEntityByName('testLight');
          if (light) {
            let lightWorldPos : Vector3 = light.getWorldPosition();
            this._shader.setUniform3f("u_lightPos", lightWorldPos.x, lightWorldPos.y, lightWorldPos.z);
            this._shader.setUniform3f("u_lightColor", 1.0, 1.0, 1.0);
          }
        }

       let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera as PerspectiveCamera;
       if (activeCamera) {
            let vewPos : Vector3 = activeCamera.getWorldPosition();
            this._shader.setUniform3f("u_viewPos", vewPos.x, vewPos.y, vewPos.z);
       }

        this._shader.setUniformMatrix4fv("u_projection", false, projection.toFloat32Array());
        this._shader.setUniformMatrix4fv("u_view", false, viewMatrix.toFloat32Array());
        this._shader.setUniformMatrix4fv("u_model", false, model.toFloat32Array());

        // 设置材质
        this._shader.setUniform3f("u_material.ambient", 1.0, 0.5, 0.31);
        this._shader.setUniform3f("u_material.diffuse", 1.0, 0.5, 0.31);
        this._shader.setUniform3f("u_material.specular", 0.5, 0.5, 0.5);
        this._shader.setUniform1f("u_material.shininess", 32.0);


        this._vertextBuffer.bind();
        this._vertextBuffer.draw();
    }
}