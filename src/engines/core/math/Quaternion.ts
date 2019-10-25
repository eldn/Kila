import { Vector3 } from "./Vector3";
import { Matrix3x3 } from "./Matrix3x3";

let _x: number = 0.0;
let _y: number = 0.0;
let _z: number = 0.0;
let _w: number = 0.0;

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

    constructor(x : number = 0, y : number = 0, z : number = 0, w : number = 1){
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
    public static fromViewUp <Out extends Quaternion, VecLike extends Vector3> (out: Out, view: VecLike, up?: Vector3) {
        Matrix3x3.fromViewUp(m3_1, view, up);
        return Quaternion.normalize(out, Quaternion.fromMat3(out, m3_1));
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

     /**
     * @zh 根据 xyz 分量计算 w 分量，默认已归一化
     */
    public static fromVector3 (out: Quaternion, b: Vector3)  : Quaternion{
        let a : Vector3 = new Vector3(b.x, b.y, b.z);
        a.normalize();
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = Math.sqrt(Math.abs(1.0 - a.x * a.x - a.y * a.y - a.z * a.z));
        return out;
    }

     /**
     * @zh 根据欧拉角信息计算四元数，旋转顺序为 YZX
     */
    public static fromEuler <Out extends Quaternion> (out: Out, x: number, y: number, z: number) {
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;

        const sx = Math.sin(x);
        const cx = Math.cos(x);
        const sy = Math.sin(y);
        const cy = Math.cos(y);
        const sz = Math.sin(z);
        const cz = Math.cos(z);

        out.x = sx * cy * cz + cx * sy * sz;
        out.y = cx * sy * cz + sx * cy * sz;
        out.z = cx * cy * sz - sx * sy * cz;
        out.w = cx * cy * cz - sx * sy * sz;

        return out;
    }

     /**
     * @zh 四元数球面插值
     */
    public static slerp <Out extends Quaternion, QuatLike_1 extends Quaternion, QuatLike_2 extends Quaternion>
     (out: Out, a: QuatLike_1, b: QuatLike_2, t: number) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations

        let scale0 = 0;
        let scale1 = 0;

        // calc cosine
        let cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            b.x = -b.x;
            b.y = -b.y;
            b.z = -b.z;
            b.w = -b.w;
        }
        // calculate coefficients
        if ((1.0 - cosom) > 0.000001) {
            // standard case (slerp)
            const omega = Math.acos(cosom);
            const sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        } else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }
        // calculate final values
        out.x = scale0 * a.x + scale1 * b.x;
        out.y = scale0 * a.y + scale1 * b.y;
        out.z = scale0 * a.z + scale1 * b.z;
        out.w = scale0 * a.w + scale1 * b.w;

        return out;
    }

    /**
     * @zh 带两个控制点的四元数球面插值
     */
    public static sqlerp <Out extends Quaternion> (out: Out, a: Out, b: Out, c: Out, d: Out, t: number) {
        Quaternion.slerp(qt_1, a, d, t);
        Quaternion.slerp(qt_2, b, c, t);
        Quaternion.slerp(out, qt_1, qt_2, 2 * t * (1 - t));
        return out;
    }

    /**
     * @zh 归一化四元数
     */
    public static normalize <Out extends Quaternion> (out: Out, a: Out) {
        let len = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = a.x * len;
            out.y = a.y * len;
            out.z = a.z * len;
            out.w = a.w * len;
        }
        return out;
    }

    /**
     * @zh 复制目标四元数
     */
    public static copy <Out extends Quaternion, QuatLike extends Quaternion> (out: Out, a: QuatLike) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = a.w;
        return out;
    }

     /**
     * @zh 四元数乘法
     */
    public static multiply <Out extends Quaternion, QuatLike_1 extends Quaternion, QuatLike_2 extends Quaternion> (out: Out, a: QuatLike_1, b: QuatLike_2) {
        _x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
        _y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z;
        _z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x;
        _w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
        out.x = _x;
        out.y = _y;
        out.z = _z;
        out.w = _w;
        return out;
    }

     /**
     * @zh 求共轭四元数，对单位四元数与求逆等价，但更高效
     */
    public static conjugate <Out extends Quaternion> (out: Out, a: Out) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = a.w;
        return out;
    }
}


const qt_1 = new Quaternion();
const qt_2 = new Quaternion();
const v3_1 = new Quaternion();
const m3_1 = new Matrix3x3();
const halfToRad = 0.5 * Math.PI / 180.0;