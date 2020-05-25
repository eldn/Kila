import Color from "../math/Color";
import { Vector3 } from "../math/Vector3";
import GameObject from "../core/GameObject";
import { WebGLRenderer } from "../renderer";
import { Camera } from "../camera";

export enum LightType{
    DirectionLight  = 0,
    PointLight = 1,
    SpotLight = 2
}


const tempColor = new Color();

export abstract class Light extends GameObject{

     /**
     * 光强度
     */
    public amount: number =  1;

    /**
     * 是否开启灯光
     */
    public enabled: boolean = true;


     /**
     * 光常量衰减值, PointLight 和 SpotLight 时生效
     */
    public constantAttenuation: number = 1;


     /**
     * 光线性衰减值, PointLight 和 SpotLight 时生效
     */
    public linearAttenuation: number = 0;


    /**
     * 光二次衰减值, PointLight 和 SpotLight 时生效\
     */
    public quadraticAttenuation: number = 0;


    private _range: number = 0;

    /**
     * 光照范围, PointLight 和 SpotLight 时生效, 0 时代表光照范围无限大。
     */
    get range() {
        return this._range;
    }

    set range(value) {
        this.constantAttenuation = 1;
        if (value <= 0) {
            this.linearAttenuation = 0;
            this.quadraticAttenuation = 0;
        } else {
            this.linearAttenuation = 4.5 / value;
            this.quadraticAttenuation = 75 / (value * value);
        }
        this._range = value;
    }

    public direction : Vector3 = new Vector3();

    /**
     * 灯光颜色
     */
    public color : Color = new Color(1, 1, 1);

    /**
     * @constructs
     */
    constructor() {
        super();
        this.color = new Color(1, 1, 1);
    }

    public getClassName() : string{
        return "Light";
    }


    /**
     * 获取光范围信息, PointLight 和 SpotLight 时生效
     * @param   out  信息接受数组
     * @param   offset 偏移值
     */
    public toInfoArray(out : Array<number>, offset : number) : Light{
        out[offset + 0] = this.constantAttenuation;
        out[offset + 1] = this.linearAttenuation;
        out[offset + 2] = this.quadraticAttenuation;
        return this;
    }

    public getRealColor() : Color {
        return tempColor.copy(this.color).scale(this.amount);
    }
}