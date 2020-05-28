import { vec3 } from "gl-matrix";
import { Quaternion } from "./Quaternion";
import { Matrix3 } from "./Matrix3";
import { Matrix4 } from "./Matrix4";
import { Vector3Notifier } from "./Vector3Notifier";


 export class Vector3 {

    /**
     * 数据
     */
    public elements : vec3;

    /**
     * Creates a new empty vec3
     * @param x X component
     * @param y Y component
     * @param z Z component
     */
    constructor(x : number = 0, y : number = 0, z : number = 0) {
       
        this.elements = vec3.fromValues(x, y, z);
    }

    public getClassName() : string{
        return "Vector3";
    }

    /**
     * Copy the values from one vec3 to this
     * @param  m the source vector
     * @return  this
     */
    public copy(v : Vector3) : Vector3 {
        vec3.copy(this.elements, v.elements);
        return this;
    }

    /**
     * Creates a new vec3 initialized with values from this vec3
     * @return a new Vector3
     */
    public clone() : Vector3 {
        const elements = this.elements;
        return new Vector3(elements[0], elements[1], elements[2]);
    }

    /**
     * 转换到数组
     * @param  array 数组
     * @param  offset 数组偏移值
     * @return
     */
    public toArray(array : Array<number> = [], offset : number = 0) : Array<number> {
        const elements = this.elements;
        array[0 + offset] = elements[0];
        array[1 + offset] = elements[1];
        array[2 + offset] = elements[2];
        return array;
    }

    /**
     * 从数组赋值
     * @param   array  数组
     * @param  offset 数组偏移值
     * @return this
     */
    public fromArray(array : Array<number>, offset : number = 0) : Vector3 {
        const elements = this.elements;
        elements[0] = array[offset + 0];
        elements[1] = array[offset + 1];
        elements[2] = array[offset + 2];
        return this;
    }

    /**
     * Set the components of a vec3 to the given values
     * @param x X component
     * @param  y Y component
     * @param  z Z component
     * @returns  this
     */
    public set(x : number, y : number, z : number) : Vector3 {
        vec3.set(this.elements, x, y, z);
        return this;
    }

    /**
     * Adds two vec3's
     * @param  a
     * @param b 如果不传，计算 this 和 a 的和
     * @returns this
     */
    public add(a : Vector3, b ?: Vector3) : Vector3{
        if (!b) {
            b = a;
            a = this;
        }
        vec3.add(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Subtracts vector b from vector a
     * @param a
     * @param b 如果不传，计算 this 和 a 的差
     * @returns  this
     */
    public subtract(a : Vector3, b ?: Vector3) : Vector3 {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.subtract(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Multiplies two vec3's
     * @param  a
     * @param b 如果不传，计算 this 和 a 的积
     * @returns this
     */
    public multiply(a : Vector3, b ?: Vector3) : Vector3{
        if (!b) {
            b = a;
            a = this;
        }
        vec3.multiply(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Divides two vec3's
     * @param  a
     * @param b 如果不传，计算 this 和 a 的商
     * @returns  this
     */
    public divide(a : Vector3, b ?: Vector3) : Vector3 {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.divide(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Math.ceil the components of this
     * @returns  this
     */
    public ceil() : Vector3 {
        vec3.ceil(this.elements, this.elements);
        return this;
    }

    /**
     * Math.floor the components of this
     * @returns  this
     */
    public floor() : Vector3 {
        vec3.floor(this.elements, this.elements);
        return this;
    }

    /**
     * Returns the minimum of two vec3's
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @returns this
     */
    public min(a : Vector3, b ?: Vector3) : Vector3 {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.min(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Returns the maximum of two vec3's
     * @param  a
     * @param  b  如果不传，计算 this 和 a 的结果
     * @returns this
     */
    public max(a : Vector3, b ?: Vector3) : Vector3 {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.max(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Math.round the components of this
     * @returns {Vector3} this
     */
    public round() {
        vec3.round(this.elements, this.elements);
        return this;
    }

    /**
     * Scales this by a scalar number
     * @param   scale amount to scale the vector by
     * @returns this
     */
    public scale(scale : number) : Vector3{
        vec3.scale(this.elements, this.elements, scale);
        return this;
    }

    /**
     * Adds two vec3's after scaling the second vector by a scalar value
     * @param  scale the amount to scale the second vector by before adding
     * @param  a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @returns  this
     */
    public scaleAndAdd(scale : number, a : Vector3, b ?: Vector3) : Vector3 {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.scaleAndAdd(this.elements, a.elements, b.elements, scale);
        return this;
    }

    /**
     * Calculates the euclidian distance between two vec3's
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return  distance between a and b
     */
    public distance(a : Vector3, b ?: Vector3) : number {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.distance(a.elements, b.elements);
    }

    /**
     * Calculates the squared euclidian distance between two vec3's
     * @param  a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return squared distance between a and b
     */
    public squaredDistance(a : Vector3, b ?: Vector3) : number {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.squaredDistance(a.elements, b.elements);
    }

    /**
     * Calculates the length of this
     * @return length of this
     */
    public length() : number {
        return vec3.length(this.elements);
    }

    /**
     * Calculates the squared length of this
     * @return  squared length of this
     */
    public squaredLength() : number {
        return vec3.squaredLength(this.elements);
    }

    /**
     * Negates the components of this
     * @returns {Vector3} this
     */
    public negate() : Vector3 {
        vec3.negate(this.elements, this.elements);
        return this;
    }

    /**
     * Returns the inverse of the components of a vec3
     * @param  a
     * @returns  this
     */
    public inverse(a : Vector3 | Vector3Notifier = this) : Vector3{
        if (!a) {
            a = this;
        }
        vec3.inverse(this.elements, a.elements);
        return this;
    }

    /**
     * Normalize this
     * @returns {Vector3} this
     */
    public normalize() {
        vec3.normalize(this.elements, this.elements);
        return this;
    }

    /**
     * Calculates the dot product of two vec3's
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return  product of a and b
     */
    public dot(a : Vector3, b ?: Vector3) : number {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.dot(a.elements, b.elements);
    }

    /**
     * Computes the cross product of two vec3's
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return   cross product of a and b
     */
    public cross(a : Vector3, b ?: Vector3) : Vector3 {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.cross(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Performs a linear interpolation between two vec3's
     * @param  v
     * @param  t interpolation amount between the two vectors
     * @returns  this
     */
    public lerp(v : Vector3, t : number) : Vector3 {
        vec3.lerp(this.elements, this.elements, v.elements, t);
        return this;
    }

    /**
     * Performs a hermite interpolation with two control points
     * @param   a
     * @param   b
     * @param   c
     * @param   d
     * @param  t interpolation amount between the two inputs
     * @return  this
     */
    public hermite(a : Vector3, b : Vector3, c : Vector3, d : Vector3, t : number) : Vector3 {
        vec3.hermite(this.elements, a.elements, b.elements, c.elements, d.elements, t);
        return this;
    }

    /**
     * Performs a bezier interpolation with two control points
     * @param  {Vector3} a
     * @param  {Vector3} b
     * @param  {Vector3} c
     * @param  {Vector3} d
     * @param  {Number} t interpolation amount between the two inputs
     * @return {Vector3} this
     */
    public bezier(a : Vector3, b : Vector3, c : Vector3, d : Vector3, t : number) : Vector3 {
        vec3.bezier(this.elements, a.elements, b.elements, c.elements, d.elements, t);
        return this;
    }

    /**
     * Generates a random vector with the given scale
     * @param  scale Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns  this
     */
    public random(scale : number = 1) : Vector3 {
        vec3.random(this.elements, scale);
        return this;
    }

    /**
     * Transforms the vec3 with a mat3
     * @param   m matrix to transform with
     * @returns  this
     */
    public transformMat3(m : Matrix3) : Vector3 {
        vec3.transformMat3(this.elements, this.elements, m.elements);
        return this;
    }

    /**
     * Transforms the vec3 with a mat4
     * @param   m matrix to transform with
     * @returns this
     */
    public transformMat4(m : Matrix4) : Vector3{
        vec3.transformMat4(this.elements, this.elements, m.elements);
        return this;
    }

    /**
     * Transforms the vec3 direction with a mat4
     * @param  m matrix to transform with
     * @returns  this
     */
    public transformDirection(m : Matrix4) : Vector3 {
        const elements = this.elements;
        const mElements = m.elements;
        const x = elements[0];
        const y = elements[1];
        const z = elements[2];

        elements[0] = x * mElements[0] + y * mElements[4] + z * mElements[8];
        elements[1] = x * mElements[1] + y * mElements[5] + z * mElements[9];
        elements[2] = x * mElements[2] + y * mElements[6] + z * mElements[10];

        return this;
    }

    /**
     * Transforms the vec3 with a quat
     * @param   q quaternion to transform with
     * @returns  this
     */
    public transformQuat(q : Quaternion) : Vector3 {
        vec3.transformQuat(this.elements, this.elements, q.elements);
        return this;
    }

    /**
     * Rotate this 3D vector around the x-axis
     * @param   origin The origin of the rotation
     * @param  rotation The angle of rotation
     * @return  this
     */
    public rotateX(origin : Vector3, rotation : number) : Vector3 {
        vec3.rotateX(this.elements, this.elements, origin.elements, rotation);
        return this;
    }

    /**
     * Rotate this 3D vector around the y-axis
     * @param  {Vector3} origin The origin of the rotation
     * @param  {Number} rotation The angle of rotation
     * @return {Vector3} this
     */
    public rotateY(origin : Vector3, rotation : number) : Vector3{
        vec3.rotateY(this.elements, this.elements, origin.elements, rotation);
        return this;
    }

    /**
     * Rotate this 3D vector around the z-axis
     * @param   origin The origin of the rotation
     * @param   rotation The angle of rotation
     * @return this
     */
    public rotateZ(origin : Vector3, rotation : number) : Vector3 {
        vec3.rotateZ(this.elements, this.elements, origin.elements, rotation);
        return this;
    }

    public rotate(rotation : Quaternion) : Vector3{
		let conjugate : Quaternion = rotation.conjugate();
		let w : Quaternion = rotation.mulVec3(this).multiply(conjugate);
		return new Vector3(w.x, w.y, w.z);
    }
    
    /**
     * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
     * @param   a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return  True if the vectors are equal, false otherwise.
     */
    public exactEquals(a : Vector3, b ?: Vector3) : boolean{
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.exactEquals(a.elements, b.elements);
    }

    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     * @param  a
     * @param  b 如果不传，计算 this 和 a 的结果
     * @return  True if the vectors are equal, false otherwise.
     */
    public equals(a : Vector3, b ?: Vector3) : boolean {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.equals(a.elements, b.elements);
    }

     public get x(): number {
        return this.elements[0];
     }

     public set x(value: number) {
        this.elements[0] = value;
     }

    /**
     * Y component
     */
     public get y(): number {
        return this.elements[1];
     }

     public set y(value: number) {
        this.elements[1] = value;
     }

    /**
     * Z component
     */
     public get z(): number {
        return this.elements[2];
     }

     public set z(value: number) {
        this.elements[2] = value;
     }

     public sub(a : Vector3, b ?: Vector3){
        return this.subtract(a, b);
    }

    public mul(a : Vector3, b ?: Vector3){
        return this.multiply(a, b);
    }

    public div(a : Vector3, b ?: Vector3){
        return this.divide(a, b);
    }

    public dist(a : Vector3, b ?: Vector3){
        return this.distance(a, b);
    }

    public sqrDist(a : Vector3, b ?: Vector3){
        return this.squaredDistance(a, b);
    }

    public len(){
        return this.length()
    }

    public sqrLen(){
        return this.squaredLength();
    }
}
