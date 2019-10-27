import { GLBuffer } from "../../gl/GLBuffer";
import { gl } from "../../gl/GLUtilities";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { LightShader } from "../../gl/shaders/LightShader";
import { AttributeInfo } from "../../gl/AttributeInfo";
import { Color } from "../../graphics/Color";

export class DirectionLight{

    private _name : string;;
    private _vertextBuffer : GLBuffer;
    private _shader : LightShader;
    private _color : Color;

    constructor(name : string, color : Color){
        this._name = name;
        this._color = color;
        this._vertextBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._shader = new LightShader();
    }

    public get name(): string {
        return this._name;
    }


    public load() :void{

         

         let vertices : Array<number> = [
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,  
            0.5,  0.5, -0.5, 
            0.5,  0.5, -0.5, 
           -0.5,  0.5, -0.5, 
           -0.5, -0.5, -0.5, 
       
           -0.5, -0.5,  0.5, 
            0.5, -0.5,  0.5, 
            0.5,  0.5,  0.5,  
            0.5,  0.5,  0.5,  
           -0.5,  0.5,  0.5, 
           -0.5, -0.5,  0.5, 
       
           -0.5,  0.5,  0.5,  
           -0.5,  0.5, -0.5,  
           -0.5, -0.5, -0.5, 
           -0.5, -0.5, -0.5, 
           -0.5, -0.5,  0.5, 
           -0.5,  0.5,  0.5,  
       
            0.5,  0.5,  0.5,  
            0.5,  0.5, -0.5,  
            0.5, -0.5, -0.5,  
            0.5, -0.5, -0.5, 
            0.5, -0.5,  0.5,  
            0.5,  0.5,  0.5,  
       
           -0.5, -0.5, -0.5, 
            0.5, -0.5, -0.5,  
            0.5, -0.5,  0.5,  
            0.5, -0.5,  0.5,  
           -0.5, -0.5,  0.5,  
           -0.5, -0.5, -0.5,  
       
           -0.5,  0.5, -0.5,  
            0.5,  0.5, -0.5, 
            0.5,  0.5,  0.5,  
            0.5,  0.5,  0.5,  
           -0.5,  0.5,  0.5,  
           -0.5,  0.5, -0.5,  
         ];

         // 顶点数据
         let positionAttribute = new AttributeInfo();
         positionAttribute.location = 0;
         positionAttribute.size = 3;
         this._vertextBuffer.addAttributeLocation(positionAttribute);
 
         this._vertextBuffer.setData(vertices);
         this._vertextBuffer.upload();
         this._vertextBuffer.unbind();
    }


    public draw(shader: Shader, model: Matrix4x4, projection : Matrix4x4, viewMatrix : Matrix4x4) :void{

        this._shader.use();

        this._shader.setUniformMatrix4fv("u_projection", false, projection.toFloat32Array());
        this._shader.setUniformMatrix4fv("u_view", false, viewMatrix.toFloat32Array());

        this._shader.setUniformMatrix4fv("u_model", false, model.toFloat32Array());
        // this._shader.setUniform4fv("u_tint", this._color.toFloat32Array());


        this._vertextBuffer.bind();
        this._vertextBuffer.draw();
    }
}