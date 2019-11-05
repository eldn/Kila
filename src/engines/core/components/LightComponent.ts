import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./BaseComponent";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";
import { PointLight } from "../world/lights/PointLight";
import { Color } from "../graphics/Color";
import { DirectionLight } from "../world/lights/DirectionLight";
import { LightType, Light } from "../world/lights/Light";
import { SpotLight } from "../world/lights/Spotlight";
import { TEntity } from "../world/Entity";



export class LightRendererCoponentData implements IComponentData {
    public name: string;
    public color: Color;
    public lightType : LightType;

    public setFromJson(json: any): void {
        
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.color !== undefined) {
            this.color = Color.fromJson(json.color);
        }

        if (json.lightType !== undefined) {
            this.lightType = json.lightType;
        }
    }
}


export class LightRendererComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return "light";
    }

    public buildFromJson(json: any): IComponent {
        let data = new LightRendererCoponentData();
        data.setFromJson(json);
        return new LightRendererComponent(data);
    }
}


export class LightRendererComponent extends BaseComponent {

    private _light: Light;

    public constructor(data: LightRendererCoponentData) {
        super(data);

        switch(data.lightType){
            case LightType.DirectionLight:
                this._light = new DirectionLight( this, LightType.DirectionLight, data.name, data.color);
                break;
            case LightType.PointLight:
                this._light = new PointLight( this, LightType.PointLight, data.name, data.color);
                break;
            case LightType.SpotLight:
                this._light = new SpotLight(this, LightType.SpotLight, data.name, data.color);
                break;
            default:
                console.error("unkown light type!");
                break;
        }

        if(this._light){
            this._light.owner = this.owner;
        }
    }

    public get light() : Light{
        return this._light;
    }

    public load(): void {
        this._light.load();
    }

    public setOwner(owner: TEntity): void {
        super.setOwner(owner);
    }

    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        this._light.draw(shader, this.owner.worldMatrix, projection, viewMatrix);
        super.render(shader, projection, viewMatrix);
    }
}