import { Vector3 } from "./Vector3";


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
}