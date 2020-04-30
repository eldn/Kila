import { Vector3 } from "../../math/Vector3";
import { Light } from "./Light";
import { Renderer } from "../../renderering/Renderer";
import { Camera } from "../cameras/Camera";
import { Matrix4 } from "../../math/Matrix4";
import { LightShadow } from "./LightShadow";



const tempMatrix4 = new Matrix4();
const tempVector3 = new Vector3();

export class DirectionLight extends Light{

    /**
     * 光方向
     * @type {Vector3}
     * @default new Vector3(0, 0, 1)
     */
     direction : Vector3;

     /**
     * 阴影生成参数，默认不生成阴影
     * @default null
     * @type {object}
     * @property {boolean} [debug=false] 是否显示生成的阴影贴图
     * @property {number} [width=render.width] 阴影贴图的宽，默认为画布宽
     * @property {number} [height=render.height] 阴影贴图的高，默认为画布高
     * @property {number} [maxBias=0.05] depth最大差值，实际的bias为max(maxBias * (1 - dot(normal, lightDir)), minBias)
     * @property {number} [minBias=0.005] depth最小差值
     * @property {Object} [cameraInfo=null] 阴影摄像机信息，没有会根据当前相机自动计算
     */
    shadow: any = null;

    /**
     * @constructs
     * @param {Object} [params] 创建对象的属性参数。可包含此类的所有属性。
     */
    constructor() {
        super();
      
        this.direction = new Vector3(0, 0, 1);
    }

    lightShadow : LightShadow;

    createShadowMap(renderer : Renderer, camera : Camera) {
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
        tempVector3.copy(this.direction).transformDirection(this.owner.worldMatrix).normalize();
        return tempVector3;
    }

    getViewDirection(camera) {
        const modelViewMatrix = camera.getModelViewMatrix(this, tempMatrix4);
        tempVector3.copy(this.direction).transformDirection(modelViewMatrix).normalize();
        return tempVector3;
    }


}