
import { Matrix3 } from './Matrix3';
import { quat } from "gl-matrix";
import { Matrix4 } from './Matrix4';
import { Vector3 } from './Vector3';
import { EventObject } from '../event/EventObject';
import { Euler } from './Euler';
import { EulerNotifier } from './EulerNotifier';


const tempMat3 = new Matrix3();
const tempVec3 = new Vector3();


export class Quaternion extends EventObject{

    public elements : quat;

   /**
     * Creates a new identity quat
     * @param  x X component
     * @param  y Y component
     * @param  z Z component
     * @param  w W component
     */
    constructor(x : number = 0, y  : number= 0, z : number = 0, w  : number= 1){
        super();
        this.elements = quat.fromValues(x, y, z, w);
    }

    public getClassName() : string{
        return "Quaternion";
    }

    /**
     * Copy the values from one quat to this
     * @param   q
     * @param  dontFireEventwether or not don`t fire change event.
     * @return  this
     */
    public copy(q : Quaternion, dontFireEvent : boolean = false) : Quaternion {
        quat.copy(this.elements, q.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Creates a new quat initialized with values from an existing quaternion
     * @return  a new quaternion
     */
    public clone() : Quaternion{
        const el = this.elements;
        return new Quaternion(el[0], el[1], el[2], el[3]);
    }

    /**
     * 转换到数组
     * @param  array 数组
     * @param  offset 数组偏移值
     * @return 
     */
    public toArray(array : Array<number> = [], offset : number = 0) : Array<number> {
        const el = this.elements;

        array[offset] = el[0];
        array[offset + 1] = el[1];
        array[offset + 2] = el[2];
        array[offset + 3] = el[3];

        return array;
    }

    /**
     * 从数组赋值
     * @param   array  数组
     * @param  offset 数组偏移值
     * @param dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public fromArray(array : Array<number>, offset : number = 0, dontFireEvent : boolean = false) : Quaternion {
        const el = this.elements;

        el[0] = array[offset];
        el[1] = array[offset + 1];
        el[2] = array[offset + 2];
        el[3] = array[offset + 3];

        if (!dontFireEvent) {
            this.fire('update');
        }

        return this;
    }

    /**
     * Set the components of a quat to the given values
     * @param x  X component
     * @param  y  Y component
     * @param z  Z component
     * @param w  W component
     * @param dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public set(x : number, y : number, z : number, w : number, dontFireEvent : boolean = false) : Quaternion {
        quat.set(this.elements, x, y, z, w);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Set this to the identity quaternion
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public identity(dontFireEvent : boolean = false) : Quaternion {
        quat.identity(this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Sets a quaternion to represent the shortest rotation from one
     * vector to another.
     * @param  a the initial vector
     * @param   b the destination vector
     * @param  dontFireEventwether or not don`t fire change event.
     * @return  this
     */
    public rotationTo(a : Vector3, b : Vector3, dontFireEvent : boolean = false) : Quaternion {
        quat.rotationTo(this.elements, a.elements, b.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Sets the specified quaternion with values corresponding to the given
     * axes. Each axis is a vec3 and is expected to be unit length and
     * perpendicular to all other specified axes.
     *
     * @param  view  the vector representing the viewing direction
     * @param right the vector representing the local "right" direction
     * @param up    the vector representing the local "up" direction
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public setAxes(view : Vector3, right : Vector3, up : Vector3, dontFireEvent : boolean = false) : Quaternion {
        quat.setAxes(this.elements, view.elements, right.elements, up.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Sets a quat from the given angle and rotation axis,
     * then returns it.
     * @param  axis the axis around which to rotate
     * @param  rad the angle in radians
     * @param dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public setAxisAngle(axis : Vector3, rad : number, dontFireEvent : boolean = false) : Quaternion {
        quat.setAxisAngle(this.elements, axis.elements, rad);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Gets the rotation axis and angle for a given
     *  quaternion. If a quaternion is created with
     *  setAxisAngle, this method will return the same
     *  values as providied in the original parameter list
     *  OR functionally equivalent values.
     * Example: The quaternion formed by axis [0, 0, 1] and
     *  angle -90 is the same as the quaternion formed by
     *  [0, 0, 1] and 270. This method favors the latter.
     * @param   out_axis  Vector receiving the axis of rotation
     * @return  Angle, in radians, of the rotation
     */
    public getAxisAngle(axis : Vector3) : number{
        return quat.getAxisAngle(axis.elements, this.elements);
    }
    
    /**
     * Adds two quat's
     * @param  q
     * @param dontFireEventwether or not don`t fire change event.
     * @return  this
     */
    public add(q : Quaternion, dontFireEvent : boolean = false) : Quaternion {
        quat.add(this.elements, this.elements, q.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Multiplies two quat's
     * @param   q
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public multiply(q : Quaternion, dontFireEvent : boolean = false) : Quaternion {
        quat.multiply(this.elements, this.elements, q.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * premultiply the quat
     * @param   q
     * @param  dontFireEventwether or not don`t fire change event.
     * @return this
     */
    public premultiply(q : Quaternion, dontFireEvent : boolean = false) : Quaternion {
        quat.multiply(this.elements, q.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }


    /**
     * Scales a quat by a scalar number
     * @param  scale the vector to scale
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public scale(scale : number, dontFireEvent : boolean = false) : Quaternion {
        quat.scale(this.elements, this.elements, scale);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Rotates a quaternion by the given angle about the X axis
     * @param   rad angle (in radians) to rotate
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public rotateX(rad : number, dontFireEvent : boolean) : Quaternion {
        quat.rotateX(this.elements, this.elements, rad);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Rotates a quaternion by the given angle about the Y axis
     * @param  rad angle (in radians) to rotate
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return this
     */
    public rotateY(rad : number, dontFireEvent : boolean =  false) : Quaternion {
        quat.rotateY(this.elements, this.elements, rad);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Rotates a quaternion by the given angle about the Z axis
     * @param   rad angle (in radians) to rotate
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public rotateZ(rad : number, dontFireEvent : boolean = false) : Quaternion {
        quat.rotateZ(this.elements, this.elements, rad);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Calculates the W component of a quat from the X, Y, and Z components.
     * Assumes that quaternion is 1 unit in length.
     * Any existing W component will be ignored.
     * @param  dontFireEvent wether or not don`t fire change event.
     * @returns  this
     */
    public calculateW(dontFireEvent : boolean = false) : Quaternion {
        quat.calculateW(this.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Calculates the dot product of two quat's
     * @param  q
     * @return  dot product of two quat's
     */
    public dot(q : Quaternion) : number {
        return quat.dot(this.elements, q.elements);
    }

    /**
     * Performs a linear interpolation between two quat's
     * @param  q
     * @param  t interpolation amount between the two inputs
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public lerp(q : Quaternion, t : number, dontFireEvent : boolean = false) : Quaternion {
        quat.lerp(this.elements, this.elements, q.elements, t);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Performs a spherical linear interpolation between two quat
     * @param   q
     * @param   t interpolation amount between the two inputs
     * @param  ontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public slerp(q : Quaternion, t : number, dontFireEvent : boolean = false) : Quaternion {
        quat.slerp(this.elements, this.elements, q.elements, t);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Performs a spherical linear interpolation with two control points
     * @param   qa
     * @param   qb
     * @param   qc
     * @param  qd
     * @param  t interpolation amount
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public sqlerp(qa : Quaternion, qb : Quaternion, qc : Quaternion, qd : Quaternion, t : number, dontFireEvent : boolean = false) : Quaternion {
        quat.sqlerp(this.elements, qa.elements, qb.elements, qc.elements, qd.elements, t);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Calculates the inverse of a quat
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public invert(dontFireEvent : boolean = false) : Quaternion {
        quat.invert(this.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Calculates the conjugate of a quat
     * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public conjugate(dontFireEvent : boolean = false) : Quaternion {
        quat.conjugate(this.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Calculates the length of a quat
     * @return length of this
     */
    public length() : number{
        return quat.length(this.elements);
    }

    /**
     * Calculates the squared length of a quat
     * @return squared length of this
     */
    public squaredLength() : number {
        return quat.squaredLength(this.elements);
    }

    /**
     * Normalize this
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public normalize(dontFireEvent : boolean = false) : Quaternion {
        quat.normalize(this.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Creates a quaternion from the given 3x3 rotation matrix.
     *
     * NOTE: The resultant quaternion is not normalized, so you should be sure
     * to renormalize the quaternion yourself where necessary.
     *
     * @param  m rotation matrix
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public fromMat3(mat : Matrix3, dontFireEvent : boolean = false) : Quaternion {
        quat.fromMat3(this.elements, mat.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Creates a quaternion from the given 3x3 rotation matrix.
     *
     * NOTE: The resultant quaternion is not normalized, so you should be sure
     * to renormalize the quaternion yourself where necessary.
     *
     * @param  m rotation matrix
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public fromMat4(mat : Matrix4, dontFireEvent : boolean = false) : Quaternion {
        tempMat3.fromMat4(mat);
        this.fromMat3(tempMat3, dontFireEvent);
        return this;
    }

    /**
     * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
     * @param   q
     * @return 
     */
    public exactEquals(q : Quaternion) : boolean {
        return quat.exactEquals(this.elements, q.elements);
    }

    /**
     * Returns whether or not the quaternions have approximately the same elements in the same position.
     * @param   q
     * @return
     */
    public equals(q : Quaternion) : boolean {
        return quat.equals(this.elements, q.elements);
    }

    /**
     * Creates a quaternion from the given euler.
     * Based on https://github.com/mrdoob/three.js/blob/dev/src/math/Quaternion.js#L200
     * @param euler
     * @param  dontFireEvent wether or not don`t fire change event.
     * @return  this
     */
    public fromEuler(euler : Euler | EulerNotifier, dontFireEvent : boolean = false) : Quaternion {
        const x = euler.x * .5;
        const y = euler.y * .5;
        const z = euler.z * .5;
        const order = euler.order || 'ZYX';

        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);

        const out = this.elements;

        if (order === 'XYZ') {
            out[0] = sx * cy * cz + cx * sy * sz;
            out[1] = cx * sy * cz - sx * cy * sz;
            out[2] = cx * cy * sz + sx * sy * cz;
            out[3] = cx * cy * cz - sx * sy * sz;
        } else if (order === 'YXZ') {
            out[0] = sx * cy * cz + cx * sy * sz;
            out[1] = cx * sy * cz - sx * cy * sz;
            out[2] = cx * cy * sz - sx * sy * cz;
            out[3] = cx * cy * cz + sx * sy * sz;
        } else if (order === 'ZXY') {
            out[0] = sx * cy * cz - cx * sy * sz;
            out[1] = cx * sy * cz + sx * cy * sz;
            out[2] = cx * cy * sz + sx * sy * cz;
            out[3] = cx * cy * cz - sx * sy * sz;
        } else if (order === 'ZYX') {
            out[0] = sx * cy * cz - cx * sy * sz;
            out[1] = cx * sy * cz + sx * cy * sz;
            out[2] = cx * cy * sz - sx * sy * cz;
            out[3] = cx * cy * cz + sx * sy * sz;
        } else if (order === 'YZX') {
            out[0] = sx * cy * cz + cx * sy * sz;
            out[1] = cx * sy * cz + sx * cy * sz;
            out[2] = cx * cy * sz - sx * sy * cz;
            out[3] = cx * cy * cz - sx * sy * sz;
        } else if (order === 'XZY') {
            out[0] = sx * cy * cz - cx * sy * sz;
            out[1] = cx * sy * cz - sx * cy * sz;
            out[2] = cx * cy * sz + sx * sy * cz;
            out[3] = cx * cy * cz + sx * sy * sz;
        }

        if (!dontFireEvent) {
            this.fire('update');
        }

        return this;
    }

    /**
     * X component
     */
    public get x(): number {
        return this.elements[0];
    }

    public set x(value: number) {
        this.elements[0] = value;
        this.fire('update');
    }
    
    /**
     * Y component
     */
    public get y(): number {
        return this.elements[1];
    }

    public set y(value: number) {
        this.elements[1] = value;
        this.fire('update');
    }

    /**
     * Z component
     */
    public get z(): number {
        return this.elements[2];
    }

    public set z(value: number) {
        this.elements[2] = value;
            this.fire('update');
    }

     /**
     * W component
     */
    public get w(): number {
        return this.elements[3];
    }

    public set w(value: number) {
        this.elements[3] = value;
        this.fire('update');
    }

    public mul(a : Quaternion, b : boolean){
        return this.multiply(a, b);
    }

    public mulVec3(r : Vector3) : Quaternion{
        let w_ = -this.x * r.x - this.y * r.y - this.z * r.z;
		let x_ =  this.w * r.x + this.y * r.z - this.z * r.y;
		let y_ =  this.w * r.y + this.z * r.x - this.x * r.z;
		let z_ =  this.w * r.z + this.x * r.y - this.y * r.x;
		
		return new Quaternion(x_, y_, z_, w_);
    }

    public len(){
        return this.length();
    }


    public sqrLen(){
        return this.squaredLength();
    }

    public getForward(): Vector3{
        return tempVec3.set(0, 0, 1).rotate(this);
    }

    public getBack() : Vector3{
        return tempVec3.set(0, 0, -1).rotate(this);
    }

    public getUp() : Vector3{
        return tempVec3.set(0, 1, 0).rotate(this);
    }

    public getDown() : Vector3{
        return tempVec3.set(0, -1, 0).rotate(this);
    }

    public getRight() : Vector3{
        return tempVec3.set(1, 0, 0).rotate(this);
    }

    public getLeft() : Vector3{
        return tempVec3.set(-1, 0, 0).rotate(this);
    }
}