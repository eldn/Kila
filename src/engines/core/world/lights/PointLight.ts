import { GLBuffer } from "../../gl/GLBuffer";
import { gl } from "../../gl/GLUtilities";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { LightShader } from "../../gl/shaders/LightShader";
import { AttributeInfo } from "../../gl/AttributeInfo";
import { Color } from "../../graphics/Color";
import { Vector3 } from "../../math/Vector3";
import { Light, LightType } from "./Light";
import { TEntity } from "../Entity";
import { LightRendererComponent } from "../../components/LightComponent";

let v3_a : Vector3 = new Vector3();

export class PointLightProperty {
    ambient: Vector3 = new Vector3();
    diffuse: Vector3 = new Vector3();
    specular: Vector3 = new Vector3();

    constant : number = 1;
    linear : number = 1;
    quadratic : number = 1;

    constructor( ambient: Vector3, diffuse: Vector3, specular: Vector3,constant : number,  linear:number,quadratic:number) {
        this.ambient.copyFrom(ambient);
        this.diffuse.copyFrom(diffuse);
        this.specular.copyFrom(specular);
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
    }
}

export class PointLight extends Light{

    private static LightIndex : number = 0;

    private _vertextBuffer : GLBuffer;
    private _shader : LightShader;
    private _lightProperty: PointLightProperty;
    private _index : number = 0;

    constructor(renderComponent : LightRendererComponent, type: LightType,name : string, color : Color){
        super(renderComponent, type, name, color);

        this._vertextBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._shader = new LightShader();
        this._index = PointLight.LightIndex++;
        this._lightProperty = new PointLightProperty(new Vector3(0.05, 0.05, 0.05), new Vector3(0.8, 0.8, 0.8), new Vector3(1.0, 1.0, 1.0), 1.0, 0.09, 0.032);
    }

    public getContant() : number{
        return this._lightProperty.constant;
    }

    public getLinear() : number{
        return this._lightProperty.linear;
    }

    public getQuadratic() : number{
        return this._lightProperty.quadratic;
    }

    public getAmbient(out : Vector3) : Vector3{
        out.copyFrom(this._lightProperty.ambient);
        return out;
    }

    public getDiffuse(out : Vector3) : Vector3{
        out.copyFrom(this._lightProperty.diffuse);
        return out;
    }

    public getSpecular(out : Vector3) : Vector3{
        out.copyFrom(this._lightProperty.specular);
        return out;
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

        // draw a light cube .
        this._shader.use();
        this._shader.setUniformMatrix4fv("u_projection", false, projection.toFloat32Array());
        this._shader.setUniformMatrix4fv("u_view", false, viewMatrix.toFloat32Array());
        this._shader.setUniformMatrix4fv("u_model", false, model.toFloat32Array());
        this._vertextBuffer.bind();
        this._vertextBuffer.draw();

        
    }

    public setShaderProperty(shader: Shader) : void{
        
        let renderComponent : LightRendererComponent = this.getRenderComponent();
        if(!renderComponent){
            return;
        }

        if(!renderComponent.owner){
            return;
        }

        let position : Vector3 = renderComponent.owner.getWorldPosition(v3_a);
        // set shader's light uniform.
        shader.setUniform3f(`u_pointLights[${this._index}].position`, position.x, position.y, position.z);
        shader.setUniform3f(`u_pointLights[${this._index}].ambient`, this._lightProperty.ambient.x, this._lightProperty.ambient.y, this._lightProperty.ambient.z);
        shader.setUniform3f(`u_pointLights[${this._index}].diffuse`, this._lightProperty.diffuse.x, this._lightProperty.diffuse.y, this._lightProperty.diffuse.z);
        shader.setUniform3f(`u_pointLights[${this._index}].specular`, this._lightProperty.specular.x, this._lightProperty.specular.y, this._lightProperty.specular.z);

         // 设置衰减属性
         shader.setUniform1f(`u_pointLights[${this._index}].constant`, this._lightProperty.constant);
         shader.setUniform1f(`u_pointLights[${this._index}].linear`, this._lightProperty.linear);
         shader.setUniform1f(`u_pointLights[${this._index}].quadratic`, this._lightProperty.quadratic);
    }
}