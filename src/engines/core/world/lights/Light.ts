import { Color } from "../../graphics/Color";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { TEntity } from "../Entity";

export enum LightType{
    DirectionLight  = 0,
    PointLight = 1,
    SpotLight = 2
}

export class Light{

    private _name : string;
    private _color : Color;
    private _owner : TEntity;
    private _type : LightType;

    constructor(owner : TEntity, type : LightType, name : string, color : Color){
        this.owner = owner;
        this._type = type;
        this._name = name;
        this._color = new Color(color.r, color.g, color.b, color.a);
    }

    public get type() : LightType{
        return this._type;
    }

    public set owner(owner : TEntity){
        this._owner = owner;
    }

    public get owner() : TEntity{
        return this._owner;
    }

    public get name(): string {
        return this._name;
    }

    public get color() : Color{
        return new Color(this.color.r, this.color.g, this.color.b, this.color.a);
    }

    public load() :void{
     
    }


    public draw(shader: Shader, model: Matrix4x4, projection : Matrix4x4, viewMatrix : Matrix4x4) :void{

     
    }
}