import { Light } from "./Light";
import { Matrix4 } from "../math/Matrix4";
import { Vector3 } from "../math/Vector3";
import math from "../math/math";
import { Vector4, Vector2 } from "../math";
import { Camera } from "../camera";

const tempMatrix4 = new Matrix4();
const tempVector3 = new Vector3();

export class SpotLight extends Light{

    public getClassName() : string{
        return "SpotLight";
    }

    public _cutoffCos: number = 0.9763;
    public _cutoff: number = 12.5;

    /**
     * 切光角(角度)，落在这个角度之内的光亮度为1
     */
    get cutoff() : number {
        return this._cutoff;
    }

    set cutoff(value : number) {
        this._cutoff = value;
        this._cutoffCos = Math.cos(math.degToRad(value));
    }
    
    public _outerCutoffCos: number =  0.9537;
    public _outerCutoff: number = 17.5;

    /**
     * 外切光角(角度)，在切光角合外切光角之间的光亮度渐变到0
     */
    get outerCutoff() : number {
        return this._outerCutoff;
    }

    set outerCutoff(value : number) {
        this._outerCutoff = value;
        this._outerCutoffCos = Math.cos(math.degToRad(value));
    }

    /**
     * 光方向
     */
    direction : Vector3 = new Vector3(0, 0, 1);
  
    constructor() {
       super();
    }

    public getWorldDirection() : Vector3 {
        tempVector3.copy(this.direction).transformDirection(this.worldMatrix).normalize();
        return tempVector3;
    }

    public getViewDirection(camera : Camera) : Vector3 {
        const modelViewMatrix = camera.getModelViewMatrix(this, tempMatrix4);
        tempVector3.copy(this.direction).transformDirection(modelViewMatrix).normalize();
        return tempVector3;
    }

}