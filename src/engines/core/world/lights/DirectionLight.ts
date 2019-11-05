
import { Color } from "../../graphics/Color";
import { Vector3 } from "../../math/Vector3";
import { Light, LightType } from "./Light";
import { TEntity } from "../Entity";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { LightRendererComponent } from "../../components/LightComponent";


class DirectionLightProperty {
    direction: Vector3 = new Vector3()
    ambient: Vector3 = new Vector3();
    diffuse: Vector3 = new Vector3();
    specular: Vector3 = new Vector3();

    constructor(direction: Vector3, ambient: Vector3, diffuse: Vector3, specular: Vector3) {
        this.direction.copyFrom(direction);
        this.ambient.copyFrom(ambient);
        this.diffuse.copyFrom(diffuse);
        this.specular.copyFrom(specular);
    }
}

export class DirectionLight extends Light{

    private _lightProperty : DirectionLightProperty;

    constructor(renderComponent : LightRendererComponent, type: LightType,name : string, color : Color){
        super(renderComponent, type, name, color);
        this._lightProperty = new DirectionLightProperty(new Vector3(-0.2, -1.0, -0.3), new Vector3(0.3, 0.24, 0.14), new Vector3(0.7, 0.42, 0.26), new Vector3(0.5, 0.5, 0.5));
    }

    public getDirection(out : Vector3) : Vector3{
        out.copyFrom(this._lightProperty.direction);
        return out;
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

    public draw(shader: Shader, model: Matrix4x4, projection : Matrix4x4, viewMatrix : Matrix4x4) : void{

        
    }


    
    public setShaderProperty(shader: Shader) : void{
        shader.setUniform3f("u_dirLight.direction", this._lightProperty.direction.x, this._lightProperty.direction.y, this._lightProperty.direction.z);
        shader.setUniform3f("u_dirLight.ambient", this._lightProperty.ambient.x, this._lightProperty.ambient.y, this._lightProperty.ambient.z);
        shader.setUniform3f("u_dirLight.diffuse", this._lightProperty.diffuse.x, this._lightProperty.diffuse.y, this._lightProperty.diffuse.z);
        shader.setUniform3f("u_dirLight.specular", this._lightProperty.specular.x, this._lightProperty.specular.y, this._lightProperty.specular.z);
    }

}