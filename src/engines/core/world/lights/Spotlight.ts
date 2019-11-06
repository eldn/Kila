import { Vector3 } from "../../math/Vector3";
import { Light, LightType } from "./Light";
import { Color } from "../../graphics/Color";
import { Shader } from "../../gl/shaders/Shader";
import { PerspectiveCamera } from "../cameras/PerspectiveCamera";
import { LevelManager } from "../LevelManager";
import { LightRendererComponent } from "../../components/LightComponent";

let v3_a : Vector3 = new Vector3();

class SpotLightProperty {
    position : Vector3 = new Vector3();
    direction: Vector3 = new Vector3();
    
    ambient: Vector3 = new Vector3();
    diffuse: Vector3 = new Vector3();
    specular: Vector3 = new Vector3();

    cutOff : number = 0;
    outerCutOff : number = 0;

    constructor(position : Vector3, direction: Vector3, ambient: Vector3, diffuse: Vector3, specular: Vector3, cutOff : number, outerCutOff : number) {
        this.position.copyFrom(position);
        this.direction.copyFrom(direction);
        this.ambient.copyFrom(ambient);
        this.diffuse.copyFrom(diffuse);
        this.specular.copyFrom(specular);
        this.cutOff = cutOff;
        this.outerCutOff = outerCutOff;
    }
}

export class SpotLight extends Light{

    private _lightProperty : SpotLightProperty;

    constructor(renderComponent : LightRendererComponent, type: LightType,name : string, color : Color){
        super(renderComponent, type, name, color);
        this._lightProperty = new SpotLightProperty(new Vector3(), new Vector3(), new Vector3(0.2, 0.2, 0.2), new Vector3(0.5, 0.5, 0.5), new Vector3(1.0, 1.0, 1.0), Math.cos(this.radians(12.5)), Math.cos(this.radians(17.5)));
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

    public setShaderProperty(shader: Shader) : void{

        let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera as PerspectiveCamera;
        if (!activeCamera) {
            return;
        }
     
        // 设置光的位置和属性
        let position : Vector3 = activeCamera.getWorldPosition(v3_a);
        shader.setUniform3f("u_spotLight.position", position.x, position.y, position.z);

        let direction : Vector3 = activeCamera.getFront(v3_a);
        shader.setUniform3f("u_spotLight.direction", direction.x, direction.y, direction.z);

        shader.setUniform1f("u_spotLight.cutOff", this._lightProperty.cutOff);

        shader.setUniform1f("u_spotLight.outerCutOff", this._lightProperty.outerCutOff);

        // set shader's light uniform.
        shader.setUniform3f(`u_spotLight.ambient`, this._lightProperty.ambient.x, this._lightProperty.ambient.y, this._lightProperty.ambient.z);
        shader.setUniform3f(`u_spotLight.diffuse`, this._lightProperty.diffuse.x, this._lightProperty.diffuse.y, this._lightProperty.diffuse.z);
        shader.setUniform3f(`u_spotLight.specular`, this._lightProperty.specular.x, this._lightProperty.specular.y, this._lightProperty.specular.z);
    }

    
}