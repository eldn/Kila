import { Vector3 } from "../../math/Vector3";
import { Light, LightType } from "./Light";
import { Matrix4 } from "../../math/Matrix4";
import math from "../../math/math";
import { LightShadow } from "./LightShadow";

const tempMatrix4 = new Matrix4();
const tempVector3 = new Vector3();

export class SpotLight extends Light{

    
    /**
     * 阴影生成参数，默认不生成阴影
     * @default null
     * @type {object}
     * @property {boolean} [debug=false] 是否显示生成的阴影贴图
     * @property {number} [width=render.width] 阴影贴图的宽，默认为画布宽
     * @property {number} [height=render.height] 阴影贴图的高，默认为画布高
     * @property {number} [bias=0.005] depth最小差值，大于才显示阴影
     * @property {Object} [cameraInfo=null] 阴影摄像机信息, 没有会根据当前相机自动计算
     */
    shadow: any = null;
    _cutoffCos: number = 0.9763;
    _cutoff: number = 12.5;

    /**
     * 切光角(角度)，落在这个角度之内的光亮度为1
     * @default 12.5
     * @type {number}
     */
    get cutoff() {
        return this._cutoff;
    }
    
    set cutoff(value) {
        this._cutoff = value;
        this._cutoffCos = Math.cos(math.degToRad(value));
    }


    _outerCutoffCos: number = 0.9537;
    _outerCutoff: number = 17.5;
    /**
     * 外切光角(角度)，在切光角合外切光角之间的光亮度渐变到0
     * @default 17.5
     * @type {number}
     */
    get outerCutoff() {
        return this._outerCutoff;
    }

    set outerCutoff(value) {
        this._outerCutoff = value;
        this._outerCutoffCos = Math.cos(math.degToRad(value));
    }
    
    /**
     * @constructs
     * @param {Object} [params] 创建对象的属性参数。可包含此类的所有属性。
     */
    constructor() {
        super();

        /**
         * 光方向
         * @type {Vector3}
         * @default new Vector3(0, 0, 1)
         */
        this.direction = new Vector3(0, 0, 1);
    }

    public lightShadow : LightShadow;

    createShadowMap(renderer, camera) {
        if (!this.shadow) {
            return;
        }
        if (!this.lightShadow) {
            this.lightShadow = new LightShadow({
                light: this,
                renderer,
                width: this.shadow.width || renderer.width,
                height: this.shadow.height || renderer.height,
                debug: this.shadow.debug,
                cameraInfo: this.shadow.cameraInfo
            });
            if ('minBias' in this.shadow) {
                this.lightShadow.minBias = this.shadow.minBias;
            }
            if ('maxBias' in this.shadow) {
                this.lightShadow.maxBias = this.shadow.maxBias;
            }
        }
        this.lightShadow.createShadowMap(camera);
    }

    getWorldDirection() {
        tempVector3.copy(this.direction).transformDirection(this._owner.worldMatrix).normalize();
        return tempVector3;
    }

    getViewDirection(camera) {
        const modelViewMatrix = camera.getModelViewMatrix(this, tempMatrix4);
        tempVector3.copy(this.direction).transformDirection(modelViewMatrix).normalize();
        return tempVector3;
    }

    
}