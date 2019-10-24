import { Vector3 } from "./Vector3";
import { Matrix3x3 } from "./Matrix3x3";


export class Quaternion{

    private _x: number;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    private _y: number;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }
    private _z: number;
    public get z(): number {
        return this._z;
    }
    public set z(value: number) {
        this._z = value;
    }
    private _w: number;

    public get w(): number {
        return this._w;
    }

    public set w(value: number) {
        this._w = value;
    }

    constructor(x : number, y : number, z : number, w : number){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    public length() : number{
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    public normalize() : Quaternion{
        let length : number = this.length();
        this.x /= length;
        this.y /= length;
        this.z /= length;
        this.w /= length;
        return this;
    }

    public mul(v : Quaternion) : Quaternion{
        let w : number = this.w * v.w - this.x * v.x - this.y * v.y - this.z * v.z;
        let x : number = this.x * v.w + this.w * v.x + this.y * v.z - this.z * v.y;
        let y : number = this.y * v.w + this.w * v.y + this.z * v.x - this.x * v.z;
        let z : number = this.z * v.w + this.w * v.z + this.x * v.y - this.y * v.x;
        return new Quaternion(x, y, z , w);
    }

    public mulV3(v : Vector3) : Quaternion{
        let w : number = -this.x * v.x - this.y * v.y - this.z * v.z;
        let x : number =  this.w * v.x + this.y * v.z - this.z * v.y;
        let y : number =  this.w * v.y + this.z * v.x - this.x * v.z;
        let z : number =  this.w * v.z + this.x * v.y - this.y * v.x;
        return new Quaternion(x, y, z , w);
    }

    public conjugate() : Quaternion{
        return new Quaternion(-this.x, -this.y, -this.z, -this.w);
    }

    /**
     * @zh 根据视口的前方向和上方向计算四元数
     * @param view 视口面向的前方向，必须归一化
     * @param up 视口的上方向，必须归一化，默认为 (0, 1, 0)
     */
    public static fromViewUp (view: Vector3, up : Vector3 = new Vector3(0, 1, 0)) {
        let m3_1 : Matrix3x3 = new Matrix3x3();
        Matrix3x3.fromViewUp(m3_1, view, up);
        let quat : Quaternion = new Quaternion(1,1,1,1);
        Quaternion.fromMat3(quat, m3_1);
        return quat.normalize();
    }

     /**
     * @zh 根据三维矩阵信息计算四元数，默认输入矩阵不含有缩放信息
     */
    public static fromMat3 (out: Quaternion, m: Matrix3x3) {
        const {
            m00: m00, m03: m01, m06: m02,
            m01: m10, m04: m11, m07: m12,
            m02: m20, m05: m21, m08: m22,
        } = m;

        const trace = m00 + m11 + m22;

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);

            out.w = 0.25 / s;
            out.x = (m21 - m12) * s;
            out.y = (m02 - m20) * s;
            out.z = (m10 - m01) * s;

        } else if ((m00 > m11) && (m00 > m22)) {
            const s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

            out.w = (m21 - m12) / s;
            out.x = 0.25 * s;
            out.y = (m01 + m10) / s;
            out.z = (m02 + m20) / s;

        } else if (m11 > m22) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

            out.w = (m02 - m20) / s;
            out.x = (m01 + m10) / s;
            out.y = 0.25 * s;
            out.z = (m12 + m21) / s;

        } else {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

            out.w = (m10 - m01) / s;
            out.x = (m02 + m20) / s;
            out.y = (m12 + m21) / s;
            out.z = 0.25 * s;
        }

        return out;
    }
}