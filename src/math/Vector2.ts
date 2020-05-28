import { Vector3 } from "./Vector3";
import { vec2, vec3 } from "gl-matrix";
import { Matrix3 } from "./Matrix3";
import { Matrix4 } from "./Matrix4";

export class Vector2 {

    /**
     * 数据
     */
    public elements : vec2;

   /**
     * Creates a new empty vec2
     * @param x X component
     * @param y Y component
     */
    constructor(x : number = 0, y : number = 0) {
        this.elements = vec2.fromValues(x, y);
    }

    public getClassName() : string{
        return "Vector2";
    }

    /**
     * Copy the values from one vec2 to this
     * @param   m the source vector
     * @return  this
     */
    public copy(v : Vector2) : Vector2 {
        vec2.copy(this.elements, v.elements);
        return this;
    }

    /**
     * Creates a new vec2 initialized with values from this vector
     * @return  a new Vector2
     */
    public clone() : Vector2{
        const elements = this.elements;
        return new Vector2(elements[0], elements[1]);
    }

    /**
     * 转换到数组
     * @param  array 数组
     * @param  offset 数组偏移值
     * @return 
     */
    public toArray(array : Array<number> = [], offset : number = 0) : Array<number>{
        const elements = this.elements;
        array[0 + offset] = elements[0];
        array[1 + offset] = elements[1];
        return array;
    }

    /**
     * 从数组赋值
     * @param   array  数组
     * @param  offset 数组偏移值
     * @return this
     */
    public fromArray(array : Array<number>, offset : number = 0) : Vector2 {
        const elements = this.elements;
        elements[0] = array[offset + 0];
        elements[1] = array[offset + 1];
        return this;
    }

    /**
     * Set the components of a vec4 to the given values
     * @param  x X component
     * @param  y Y component
     * @returns  this
     */
    public set(x : number, y : number) : Vector2 {
        vec2.set(this.elements, x, y);
        return this;
    }

    /**
     * Adds two vec2's
     * @param  a
     * @param b 如果不传，计算 this 和 a 的和
     * @returns this
     */
    public add(a : Vector2, b ?: Vector2) : Vector2 {
        if (!b) {
            b = a;
            a = this;
        }
        vec2.add(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Subtracts vector b from vector a
     * @param  a
     * @param b 如果不传，计算 this 和 a 的差
     * @returns this
     */
    public subtract(a : Vector2, b ?: Vector2) : Vector2 {
        if (!b) {
            b = a;
            a = this;
        }
        vec2.subtract(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Multiplies two vec2's
     * @param  a
     * @param b 如果不传，计算 this 和 a 的积
     * @returns this
     */
    public multiply(a : Vector2, b ?: Vector2) : Vector2{
        if (!b) {
            b = a;
            a = this;
        }
        vec2.multiply(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Divides two vec2's
     * @param  a
     * @param b 如果不传，计算 this 和 a 的商
     * @returns  this
     */
    public divide(a : Vector2, b ?: Vector2) : Vector2 {
        if (!b) {
            b = a;
            a = this;
        }
        vec2.divide(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Math.ceil the components of this
     * @returns this
     */
    public ceil() : Vector2 {
        vec2.ceil(this.elements, this.elements);
        return this;
    }

    /**
     * Math.floor the components of this
     * @returns  this
     */
    public floor() : Vector2 {
        vec2.floor(this.elements, this.elements);
        return this;
    }

    /**
     * Returns the minimum of two vec2's
     * @param  a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @returns  this
     */
    public min(a : Vector2, b ?: Vector2) : Vector2 {
        if (!b) {
            b = a;
            a = this;
        }
        vec2.min(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Returns the maximum of two vec2's
     * @param   a
     * @param  b  如果不传，计算 this 和 a 的结果
     * @returns this
     */
    public max(a : Vector2, b ?: Vector2) : Vector2 {
        if (!b) {
            b = a;
            a = this;
        }
        vec2.max(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Math.round the components of this
     * @returns this
     */
    public round() : Vector2 {
        vec2.round(this.elements, this.elements);
        return this;
    }

    /**
     * Scales this by a scalar number
     * @param  scale amount to scale the vector by
     * @returns this
     */
    public scale(scale : number) : Vector2 {
        vec2.scale(this.elements, this.elements, scale);
        return this;
    }

    /**
     * Adds two vec2's after scaling the second vector by a scalar value
     * @param  scale the amount to scale the second vector by before adding
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @returns this
     */
    public scaleAndAdd(scale : number, a : Vector2, b : Vector2) : Vector2 {
        if (!b) {
            b = a;
            a = this;
        }
        vec2.scaleAndAdd(this.elements, a.elements, b.elements, scale);
        return this;
    }

    /**
     * Calculates the euclidian distance between two vec2's
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return  distance between a and b
     */
    public distance(a : Vector2, b ?: Vector2) : number {
        if (!b) {
            b = a;
            a = this;
        }
        return vec2.distance(a.elements, b.elements);
    }

    /**
     * Calculates the squared euclidian distance between two vec2's
     * @param  a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return squared distance between a and b
     */
    public squaredDistance(a : Vector2, b ?: Vector2) : number {
        if (!b) {
            b = a;
            a = this;
        }
        return vec2.squaredDistance(a.elements, b.elements);
    }

    /**
     * Calculates the length of this
     * @return length of this
     */
    public length() : number {
        return vec2.length(this.elements);
    }

    /**
     * Calculates the squared length of this
     * @return  squared length of this
     */
    public squaredLength() : number {
        return vec2.squaredLength(this.elements);
    }

    /**
     * Negates the components of this
     * @returns this
     */
    public negate() : Vector2{
        vec2.negate(this.elements, this.elements);
        return this;
    }

    /**
     * Returns the inverse of the components of a vec2
     * @param  a
     * @returns  this
     */
    public inverse(a : Vector2 = this) : Vector2 {
        if (!a) {
            a = this;
        }
        vec2.inverse(this.elements, a.elements);
        return this;
    }

    /**
     * Normalize this
     * @returns  this
     */
    public normalize() : Vector2 {
        vec2.normalize(this.elements, this.elements);
        return this;
    }

    /**
     * Calculates the dot product of two vec2's
     * @param  a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return  product of a and b
     */
    public dot(a : Vector2, b ?: Vector2) : number {
        if (!b) {
            b = a;
            a = this;
        }
        return vec2.dot(a.elements, b.elements);
    }

    /**
     * Computes the cross product of two vec2's
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return   cross product of a and b
     */
    public cross(a : Vector2, b ?: Vector2) : Vector2 {
        if (!b) {
            b = a;
            a = this;
        }
        vec2.cross(this.elements as any, a.elements, b.elements);
        return this;
    }

    /**
     * Performs a linear interpolation between two vec2's
     * @param   v
     * @param   t interpolation amount between the two vectors
     * @returns  this
     */
    public lerp(v : Vector2, t : number) : Vector2 {
        vec2.lerp(this.elements, this.elements, v.elements, t);
        return this;
    }

    /**
     * Generates a random vector with the given scale
     * @param  scale Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns this
     */
    public random(scale : number = 1) : Vector2 {
        vec2.random(this.elements, scale);
        return this;
    }

    /**
     * Transforms the vec2 with a mat3
     * @param   m matrix to transform with
     * @returns  this
     */
    public transformMat3(m : Matrix3) : Vector2 {
        vec2.transformMat3(this.elements, this.elements, m.elements);
        return this;
    }

    /**
     * Transforms the vec2 with a mat4
     * @param   m matrix to transform with
     * @returns  this
     */
    public transformMat4(m : Matrix4) : Vector2 {
        vec2.transformMat4(this.elements, this.elements, m.elements);
        return this;
    }

    /**
     * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return True if the vectors are equal, false otherwise.
     */
    public exactEquals(a : Vector2, b : Vector2) : boolean {
        if (!b) {
            b = a;
            a = this;
        }
        return vec2.exactEquals(a.elements, b.elements);
    }

    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     * @param  a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return  True if the vectors are equal, false otherwise.
     */
    public equals(a : Vector2, b ?: Vector2) : boolean {
        if (!b) {
            b = a;
            a = this;
        }
        return vec2.equals(a.elements, b.elements);
    }
    /**
     * X component
     */
    get x() {
        return this.elements[0];
    }

    set x(value) {
        this.elements[0] = value;
    }
    
    /**
     * Y component
     */
    get y() {
        return this.elements[1];
    }

    set y(value) {
        this.elements[1] = value;
    }


    public sub(a : Vector2 , b ?: Vector2) : Vector2{
        return this.subtract(a, b);
    }

    public mul(a : Vector2, b ?: Vector2) : Vector2{
        return this.multiply(a, b);
    }


    public div(a : Vector2 , b ?: Vector2) : Vector2{
        return this.divide(a, b);
    }

    public dist(a : Vector2 , b : Vector2) : number{
        return this.distance(a, b);
    }

    public sqrDist(a : Vector2 , b : Vector2) : number{
        return this.squaredDistance(a, b);
    }

    public len() : number{
        return this.length();
    }

    public sqrLen(a : Vector2 , b : Vector2) : number{
        return this.squaredLength();
    }

}