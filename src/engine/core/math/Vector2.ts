import { Vector3 } from "./Vector3";

export class Vector2 {

    private _x: number;
    private _y: number;

    public constructor( x: number = 0, y: number = 0 ) {
        this._x = x;
        this._y = y;
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

    public static get zero(): Vector2 {
        return new Vector2();
    }

    public static get one(): Vector2 {
        return new Vector2( 1, 1 );
    }


    public static distance( a: Vector2, b: Vector2 ): number {
        let diff = a.clone().subtract( b );
        return Math.sqrt( diff.x * diff.x + diff.y * diff.y );
    }

   
    public copyFrom( v: Vector2 ): void {
        this._x = v._x;
        this._y = v._y;
    }

    public toArray(): number[] {
        return [this._x, this._y];
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array( this.toArray() );
    }

    public toVector3(): Vector3 {
        return new Vector3( this._x, this._y, 0 );
    }

  
    public set( x?: number, y?: number ): void {
        if ( x !== undefined ) {
            this._x = x;
        }

        if ( y !== undefined ) {
            this._y = y;
        }
    }

   
    public setFromJson( json: any ): void {
        if ( json.x !== undefined ) {
            this._x = Number( json.x );
        }

        if ( json.y !== undefined ) {
            this._y = Number( json.y );
        }
    }

    public length() : number{
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public dot(v : Vector2) : number{
        return this.x * v.x + this.y * v.y;
    }

    public normalize() : Vector2{
        let len : number = this.length();
        this.x /= len;
        this.y /= len;
        return this;
    }

    public rotate(angle : number) : Vector2{
        let rad : number = angle * (Math.PI / 180);
        let cos : number = Math.cos(rad);
        let sin : number = Math.sin(rad);
        this.x = this.x * cos - this.y * sin;
        this.y = this.x * sin + this.y * cos;
        return this;
    }

    public add( v: Vector2 ): Vector2 {
        this._x += v._x;
        this._y += v._y;

        return this;
    }

    public addValue(value : number) : Vector2{
        this.x += value;
        this.y += value;
        return this;
    }
   
    public subtract( v: Vector2 ): Vector2 {
        this._x -= v._x;
        this._y -= v._y;

        return this;
    }

    public subtractValue(value : number) : Vector2{
        this.x -= value;
        this.y -= value;
        return this;
    }
   

   
    public multiply( v: Vector2 ): Vector2 {
        this._x *= v._x;
        this._y *= v._y;

        return this;
    }

    public multiplyValue(value : number) : Vector2{
        this.x *= value;
        this.y *= value;
        return this;
    }

   
    public divide( v: Vector2 ): Vector2 {
        this._x /= v._x;
        this._y /= v._y;

        return this;
    }

    public divideValue(value : number) : Vector2{
        this.x /= value;
        this.y /= value;
        return this;
    }

   
    public scale( scale: number ): Vector2 {
        this._x *= scale;
        this._y *= scale;

        return this;
    }

    public clone(): Vector2 {
        return new Vector2( this._x, this._y );
    }
}