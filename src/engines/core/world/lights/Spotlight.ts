import { Vector3 } from "../../math/Vector3";
import { Light, LightType } from "./Light";
import { TEntity } from "../Entity";
import { Color } from "../../graphics/Color";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { PerspectiveCamera } from "../cameras/PerspectiveCamera";
import { LevelManager } from "../LevelManager";
import { LightRendererComponent } from "../../components/LightComponent";

let v3_a : Vector3 = new Vector3();

class SpotLightProperty {
    position : Vector3 = new Vector3();
    direction: Vector3 = new Vector3()

    constant : number = 1;
    linear : number = 1;
    quadratic : number = 1;
    cutOff : number = 0;
    outerCutOff : number = 0;

    
    ambient: Vector3 = new Vector3();
    diffuse: Vector3 = new Vector3();
    specular: Vector3 = new Vector3();

    constructor(position : Vector3, direction: Vector3, constant : number, linear : number, quadratic : number, cutOff : number, outerCutOff : number, ambient: Vector3, diffuse: Vector3, specular: Vector3) {
        this.position.copyFrom(position);
        this.direction.copyFrom(direction);
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
        this.cutOff = cutOff;
        this.outerCutOff = outerCutOff;
        this.ambient.copyFrom(ambient);
        this.diffuse.copyFrom(diffuse);
        this.specular.copyFrom(specular);
    }
}

export class SpotLight extends Light{

    private static LightIndex : number = 0;

    private _lightProperty : SpotLightProperty;
    private _lightIndex : number = 0;

    constructor(renderComponent : LightRendererComponent, type: LightType,name : string, color : Color){
        super(renderComponent, type, name, color);

        this._lightIndex = SpotLight.LightIndex ++;
        this._lightProperty = new SpotLightProperty(new Vector3(), new Vector3(), 1.0, 0.09, 0.032, this.radians(12.5), this.radians(17.5), new Vector3(0.0, 0.0, 0.0), new Vector3(0.8, 0.8, 0.0), new Vector3(0.8, 0.8, 0.0));
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

        let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera as PerspectiveCamera;
        if (!activeCamera) {
            return;
        }

        let cameraPos : Vector3 = activeCamera.getWorldPosition(v3_a);
        shader.setUniform3f(`u_spotLighs[${this._lightIndex}].position`, cameraPos.x, cameraPos.y, cameraPos.z);
        let cameraFront : Vector3 = activeCamera.getFront(v3_a);
        shader.setUniform3f(`u_spotLighs[${this._lightIndex}].direction`, cameraFront.x, cameraFront.y, cameraFront.z);

        shader.setUniform3f(`u_spotLighs[${this._lightIndex}].direction`, this._lightProperty.direction.x, this._lightProperty.direction.y, this._lightProperty.direction.z);
        shader.setUniform3f(`u_spotLighs[${this._lightIndex}].ambient`, this._lightProperty.ambient.x, this._lightProperty.ambient.y, this._lightProperty.ambient.z);
        shader.setUniform3f(`u_spotLighs[${this._lightIndex}].diffuse`, this._lightProperty.diffuse.x, this._lightProperty.diffuse.y, this._lightProperty.diffuse.z);
        shader.setUniform3f(`u_spotLighs[${this._lightIndex}].specular`, this._lightProperty.specular.x, this._lightProperty.specular.y, this._lightProperty.specular.z);

        shader.setUniform1f(`u_spotLighs[${this._lightIndex}].constant`, this._lightProperty.constant);
        shader.setUniform1f(`u_spotLighs[${this._lightIndex}].linear`, this._lightProperty.linear);
        shader.setUniform1f(`u_spotLighs[${this._lightIndex}].quadratic`, this._lightProperty.quadratic);
        shader.setUniform1f(`u_spotLighs[${this._lightIndex}].cutOff`, this._lightProperty.cutOff);
        shader.setUniform1f(`u_spotLighs[${this._lightIndex}].outerCutOff`, this._lightProperty.outerCutOff);
    }

}