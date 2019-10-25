import { Vector2 } from "./Vector2";
import { EPSILON } from "./Utils";
import { Matrix4x4 } from "./Matrix4x4";
import { Quaternion } from "./Quaternion";

let _x: number = 0.0;
let _y: number = 0.0;
let _z: number = 0.0;

 export class Vector3 {

    public static UNIT_X : Vector3 = Object.freeze(new Vector3(1, 0, 0)) as Vector3;
    public static UNIT_Y : Vector3  = Object.freeze(new Vector3(0, 1, 0)) as Vector3;
    public static UNIT_Z : Vector3  = Object.freeze(new Vector3(0, 0, 1)) as Vector3;
    public static ZERO : Vector3  = Object.freeze(new Vector3(0, 0, 0)) as Vector3;
    public static ONE : Vector3  = Object.freeze(new Vector3(1, 1, 1)) as Vector3;
    public static NEG_ONE : Vector3  = Object.freeze(new Vector3(-1, -1, -1)) as Vector3;

    private _x: number;
    private _y: number;
    private _z: number;


    public constructor( x: number = 0, y: number = 0, z: number = 0 ) {
        this._x = x;
        this._y = y;
        this._z = z;
    }


    public get x(): number {
        return this._x;
    }


    public set x( value: number ) {
        this._x = value;
    }


    public get y(): number {
        return this._y;
    }


    public set y( value: number ) {
        this._y = value;
    }

 
    public get z(): number {
        return this._z;
    }


    public set z( value: number ) {
        this._z = value;
    }

    public static get zero(): Vector3 {
        return new Vector3();
    }

    public static get one(): Vector3 {
        return new Vector3( 1, 1, 1 );
    }

  
    public static distance( a: Vector3, b: Vector3 ): number {
        let diff = a.subtract( b );
        return Math.sqrt( diff.x * diff.x + diff.y * diff.y + diff.z * diff.z );
    }

 
    public set( x?: number, y?: number, z?: number ): void {
        if ( x !== undefined ) {
            this._x = x;
        }

        if ( y !== undefined ) {
            this._y = y;
        }

        if ( z !== undefined ) {
            this._z = z;
        }
    }

   
    public equals( v: Vector3 ): boolean {
        return ( this.x === v.x && this.y === v.y && this.z === v.z );
    }

    public toArray(): number[] {
        return [this._x, this._y, this._z];
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array( this.toArray() );
    }

    public toVector2(): Vector2 {
        return new Vector2( this._x, this._y );
    }

 
    public copyFrom( vector: Vector3 ): void {
        this._x = vector._x;
        this._y = vector._y;
        this._z = vector._z;
    }

  
    public setFromJson( json: any ): void {
        if ( json.x !== undefined ) {
            this._x = Number( json.x );
        }

        if ( json.y !== undefined ) {
            this._y = Number( json.y );
        }

        if ( json.z !== undefined ) {
            this._z = Number( json.z );
        }
    }

   
    public add( v: Vector3 ): Vector3 {
        this._x += v._x;
        this._y += v._y;
        this._z += v._z;

        return this;
    }

    public addValue( v: number ): Vector3 {
        this._x += v;
        this._y += v;
        this._z += v;

        return this;
    }

   
    public subtract( v: Vector3 ): Vector3 {
        this._x -= v._x;
        this._y -= v._y;
        this._z -= v._z;

        return this;
    }

    public subtractValue( v: number ): Vector3 {
        this._x -= v;
        this._y -= v;
        this._z -= v;

        return this;
    }

   
    public multiply( v: Vector3 ): Vector3 {
        this._x *= v._x;
        this._y *= v._y;
        this._z *= v._z;

        return this;
    }

    public multiplyValue( v: number ): Vector3 {
        this._x *= v;
        this._y *= v;
        this._z *= v;

        return this;
    }

   
    public divide( v: Vector3 ): Vector3 {
        this._x /= v._x;
        this._y /= v._y;
        this._z /= v._z;

        return this;
    }

    public divideValue( v: number ): Vector3 {
        this._x /= v;
        this._y /= v;
        this._z /= v;

        return this;
    }

   
    public scale( scale: number ): Vector3 {
        this._x *= scale;
        this._y *= scale;
        this._z *= scale;

        return this;
    }

    public clone(): Vector3 {
        return new Vector3( this._x, this._y, this._z );
    }

     /**
     * @zh 求向量长度平方
     */
    public lengthSqr() : number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    public length() : number{
        return Math.sqrt(this.lengthSqr());
    }

    public dot(v : Vector3) : number{
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    public cross(v : Vector3) : Vector3{
        this.x = this.y * v.z - this.z * v.y;
        this.y = this.z * v.x - this.x * v.z;
        this.z = this.x * v.y - this.y * v.x;
        return this;
    }

    public normalize() : Vector3{

        if(this.lengthSqr() < EPSILON * EPSILON){
            return Vector3.ZERO;
        }

        let len : number = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }

    public rotate(angle : number) : Vector3{
        let rad : number = angle * (Math.PI / 180);
        let cos : number = Math.cos(rad);
        let sin : number = Math.sin(rad);
        this.x = this.x * cos - this.y * sin;
        this.y = this.x * sin + this.y * cos;
        return this;
    }

    /**
     * @zh 向量四元数乘法
     */
    public static transformQuat (out: Vector3, a: Vector3, q: Quaternion) {
        // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations

        // calculate quat * vec
        const ix = q.w * a.x + q.y * a.z - q.z * a.y;
        const iy = q.w * a.y + q.z * a.x - q.x * a.z;
        const iz = q.w * a.z + q.x * a.y - q.y * a.x;
        const iw = -q.x * a.x - q.y * a.y - q.z * a.z;

        // calculate result * inverse quat
        out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
        out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
        out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
        return out;
    }

    /**
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd (out: Vector3, a: Vector3, b: Vector3, scale: number) {
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    }


    /**
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    public static lerp<Out extends Vector3> (out: Out, a: Out, b: Out, t: number) {
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);
        return out;
    }


    public static add( a : Vector3, b: Vector3 ): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    /**
     * @zh 逐元素向量减法
     */
    public static subtract<Out extends Vector3> (out: Out, a: Out, b: Out) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }

      /**
     * @zh 归一化向量
     */
    public static normalize<Out extends Vector3, Vec3Like extends Vector3> (out: Out, a: Vec3Like) {
        _x = a.x;
        _y = a.y;
        _z = a.z;

        let len = _x * _x + _y * _y + _z * _z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = _x * len;
            out.y = _y * len;
            out.z = _z * len;
        }
        return out;
    }
}