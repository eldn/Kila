import { Color } from "../../graphics/Color";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { TEntity } from "../Entity";
import { LightRendererComponent } from "../../components/LightComponent";

export enum LightType{
    DirectionLight  = 0,
    PointLight = 1,
    SpotLight = 2
}

export class Light{

    private _name : string;
    private _color : Color;
    private _type : LightType;
    private _renderComponent : LightRendererComponent;

    constructor(renderComponent : LightRendererComponent, type : LightType, name : string, color : Color){
        this._renderComponent = renderComponent;
        this._type = type;
        this._name = name;
        this._color = new Color(color.r, color.g, color.b, color.a);
    }

    public get type() : LightType{
        return this._type;
    }

    public get name(): string {
        return this._name;
    }

    public get color() : Color{
        return new Color(this.color.r, this.color.g, this.color.b, this.color.a);
    }

    public load() :void{
     
    }

    public getRenderComponent() : LightRendererComponent{
        return this._renderComponent;
    }

    public radians(degrees: number): number {
        return degrees * (Math.PI / 180.0);
    }

    public draw(shader: Shader, model: Matrix4x4, projection : Matrix4x4, viewMatrix : Matrix4x4) :void{
        if(!shader){
            console.error('DirectionLight draw failed, shader null!');
        }
    }

    public setShaderProperty(shader: Shader) : void{

    }
}