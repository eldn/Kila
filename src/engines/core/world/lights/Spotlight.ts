import { Vector3 } from "../../math/Vector3";
import { Light, LightType } from "./Light";
import { TEntity } from "../Entity";
import { Color } from "../../graphics/Color";

class SpotLightProperty {
    position : Vector3 = new Vector3();
    direction: Vector3 = new Vector3()
    cutOff : number = 0;

    
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

export class SpotLight extends Light{

    private _lightProperty : SpotLightProperty;

    constructor(owner : TEntity, type: LightType,name : string, color : Color){
        super(owner, type, name, color);
        this._lightProperty = new SpotLightProperty(new Vector3(-0.2, -1.0, -0.3), new Vector3(0.2, 0.2, 0.2), new Vector3(0.5, 0.5, 0.5), new Vector3(1.0, 1.0, 1.0));
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

}