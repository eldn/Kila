import Color from "../math/Color";
import { Vector3 } from "../math/Vector3";
import GameObject from "../core/GameObject";

export enum LightType{
    DirectionLight  = 0,
    PointLight = 1,
    SpotLight = 2
}


const tempColor = new Color();

export class Light extends GameObject{

     /**
     * 光强度
     * @type {Number}
     * @default 1
     */
    amount: number =  1;

    /**
     * 是否开启灯光
     * @type {Boolean}
     * @default true
     */
    enabled: boolean = true;


     /**
     * 光常量衰减值, PointLight 和 SpotLight 时生效
     * @type {Number}
     * @readOnly
     * @default 1
     */
    constantAttenuation: number = 1;


     /**
     * 光线性衰减值, PointLight 和 SpotLight 时生效
     * @type {Number}
     * @readOnly
     * @default 0
     */
    linearAttenuation: number = 0;


    /**
     * 光二次衰减值, PointLight 和 SpotLight 时生效
     * @type {Number}
     * @readOnly
     * @default 0
     */
    quadraticAttenuation: number = 0;


    private _range: number = 0;

    /**
     * 光照范围, PointLight 和 SpotLight 时生效, 0 时代表光照范围无限大。
     * @type {Number}
     * @default 0
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


    direction : Vector3 = new Vector3();

    /**
     * 灯光颜色
     * @default new Color(1, 1, 1)
     * @type {Color}
     */
    public color : Color;

    /**
     * @constructs
     * @param {Object} [params] 创建对象的属性参数。可包含此类的所有属性。
     */
    constructor() {
        super();
        this.color = new Color(1, 1, 1);
    }

    getClassName() : string{
        return "Light";
    }


    /**
     * 获取光范围信息, PointLight 和 SpotLight 时生效
     * @param  {Array} out  信息接受数组
     * @param  {Number} offset 偏移值
     */
    public toInfoArray(out : Array<number>, offset : number) {
        out[offset + 0] = this.constantAttenuation;
        out[offset + 1] = this.linearAttenuation;
        out[offset + 2] = this.quadraticAttenuation;
        return this;
    }

    getRealColor() {
        return tempColor.copy(this.color).scale(this.amount);
    }


     /**
     * 生成阴影贴图，支持阴影的子类需要重写
     * @param  {WebGLRenderer} renderer
     * @param  {Camera} camera
     */
    createShadowMap(renderer, camera) { // eslint-disable-line no-unused-vars

    }

}