
import { Matrix3 } from './Matrix3';
import { quat } from "gl-matrix";
import { Matrix4 } from './Matrix4';
import { Vector3 } from './Vector3';
import { EventNode } from '../event/EventNode';


const tempMat3 = new Matrix3();
const tempVec3 = new Vector3();


export class Quaternion extends EventNode{

    public elements : quat;

   /**
     * Creates a new identity quat
     * @constructs
     * @param  {Number} [x=0] X component
     * @param  {Number} [y=0] Y component
     * @param  {Number} [z=0] Z component
     * @param  {Number} [w=1] W component
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
        super();
        this.elements = quat.fromValues(x, y, z, w);
    }

    /**
     * Copy the values from one quat to this
     * @param  {Quaternion} q
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    copy(q : Quaternion, dontFireEvent ?: boolean) {
        quat.copy(this.elements, q.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Creates a new quat initialized with values from an existing quaternion
     * @return {Quaternion} a new quaternion
     */
    clone() {
        const el = this.elements;
        return new Quaternion(el[0], el[1], el[2], el[3]);
    }

    /**
     * 转换到数组
     * @param  {Array}  [array=[]] 数组
     * @param  {Number} [offset=0] 数组偏移值
     * @return {Array}
     */
    toArray(array = [], offset = 0) {
        const el = this.elements;

        array[offset] = el[0];
        array[offset + 1] = el[1];
        array[offset + 2] = el[2];
        array[offset + 3] = el[3];

        return array;
    }
    /**
     * 从数组赋值
     * @param  {Array} array  数组
     * @param  {Number} [offset=0] 数组偏移值
     * @param {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    fromArray(array, offset = 0, dontFireEvent) {
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
     * @param {Number} x  X component
     * @param {Number} y  Y component
     * @param {Number} z  Z component
     * @param {Number} w  W component
     * @param {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    set(x, y, z, w, dontFireEvent) {
        quat.set(this.elements, x, y, z, w);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }

    /**
     * Set this to the identity quaternion
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    identity(dontFireEvent) {
        quat.identity(this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Sets a quaternion to represent the shortest rotation from one
     * vector to another.
     * @param  {Vector3} a the initial vector
     * @param  {Vector3} b the destination vector
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    rotationTo(a, b, dontFireEvent) {
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
     * @param {Vector3} view  the vector representing the viewing direction
     * @param {Vector3} right the vector representing the local "right" direction
     * @param {Vector3} up    the vector representing the local "up" direction
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    setAxes(view, right, up, dontFireEvent) {
        quat.setAxes(this.elements, view.elements, right.elements, up.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Sets a quat from the given angle and rotation axis,
     * then returns it.
     * @param {Vector3} axis the axis around which to rotate
     * @param {Number} rad the angle in radians
     * @param {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    setAxisAngle(axis, rad, dontFireEvent) {
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
     * @param  {Vector3} out_axis  Vector receiving the axis of rotation
     * @return {Number} Angle, in radians, of the rotation
     */
    getAxisAngle(axis) {
        return quat.getAxisAngle(axis.elements, this.elements);
    }
    /**
     * Adds two quat's
     * @param {Quaternion} q
     * @param {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    add(q, dontFireEvent) {
        quat.add(this.elements, this.elements, q.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Multiplies two quat's
     * @param  {Quaternion} q
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    multiply(q, dontFireEvent ?: boolean) {
        quat.multiply(this.elements, this.elements, q.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * premultiply the quat
     * @param  {Quaternion} q
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    premultiply(q, dontFireEvent) {
        quat.multiply(this.elements, q.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Scales a quat by a scalar number
     * @param  {Vector3} scale the vector to scale
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    scale(scale, dontFireEvent) {
        quat.scale(this.elements, this.elements, scale);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Rotates a quaternion by the given angle about the X axis
     * @param  {Number} rad angle (in radians) to rotate
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    rotateX(rad, dontFireEvent) {
        quat.rotateX(this.elements, this.elements, rad);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Rotates a quaternion by the given angle about the Y axis
     * @param  {Number} rad angle (in radians) to rotate
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    rotateY(rad, dontFireEvent) {
        quat.rotateY(this.elements, this.elements, rad);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Rotates a quaternion by the given angle about the Z axis
     * @param  {Number} rad angle (in radians) to rotate
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    rotateZ(rad, dontFireEvent) {
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
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @returns {Quaternion} this
     */
    calculateW(dontFireEvent) {
        quat.calculateW(this.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Calculates the dot product of two quat's
     * @param  {Quaternion} q
     * @return {Number} dot product of two quat's
     */
    dot(q) {
        return quat.dot(this.elements, q.elements);
    }
    /**
     * Performs a linear interpolation between two quat's
     * @param  {Quaternion} q
     * @param  {Number} t interpolation amount between the two inputs
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    lerp(q, t, dontFireEvent) {
        quat.lerp(this.elements, this.elements, q.elements, t);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Performs a spherical linear interpolation between two quat
     * @param  {Quaternion} q
     * @param  {Number} t interpolation amount between the two inputs
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    slerp(q, t, dontFireEvent) {
        quat.slerp(this.elements, this.elements, q.elements, t);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Performs a spherical linear interpolation with two control points
     * @param  {Quaternion} qa
     * @param  {Quaternion} qb
     * @param  {Quaternion} qc
     * @param  {Quaternion} qd
     * @param  {Number} t interpolation amount
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    sqlerp(qa, qb, qc, qd, t, dontFireEvent) {
        quat.sqlerp(this.elements, qa.elements, qb.elements, qc.elements, qd.elements, t);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Calculates the inverse of a quat
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    invert(dontFireEvent) {
        quat.invert(this.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Calculates the conjugate of a quat
     * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    conjugate(dontFireEvent ?: boolean) {
        quat.conjugate(this.elements, this.elements);
        if (!dontFireEvent) {
            this.fire('update');
        }
        return this;
    }
    /**
     * Calculates the length of a quat
     * @return {Number} length of this
     */
    length() {
        return quat.length(this.elements);
    }
    /**
     * Calculates the squared length of a quat
     * @return {Number} squared length of this
     */
    squaredLength() {
        return quat.squaredLength(this.elements);
    }
    /**
     * Normalize this
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    normalize(dontFireEvent) {
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
     * @param {Matrix3} m rotation matrix
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    fromMat3(mat, dontFireEvent) {
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
     * @param {Matrix4} m rotation matrix
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    fromMat4(mat : Matrix4, dontFireEvent ?: boolean) {
        tempMat3.fromMat4(mat);
        this.fromMat3(tempMat3, dontFireEvent);
        return this;
    }
    /**
     * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
     * @param  {Quaternion} q
     * @return {Boolean}
     */
    exactEquals(q) {
        return quat.exactEquals(this.elements, q.elements);
    }
    /**
     * Returns whether or not the quaternions have approximately the same elements in the same position.
     * @param  {Quaternion} q
     * @return {Boolean}
     */
    equals(q) {
        return quat.equals(this.elements, q.elements);
    }
    /**
     * Creates a quaternion from the given euler.
     * @param  {Euler} euler
     * @param  {Boolean} [dontFireEvent=false] wether or not don`t fire change event.
     * @return {Quaternion} this
     */
    fromEuler(euler, dontFireEvent ?: boolean) {
        // Based on https://github.com/mrdoob/three.js/blob/dev/src/math/Quaternion.js#L200

        // quat.fromEuler(this.elements, euler.x, euler.y, euler.z);
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
     * @type {Number}
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
     * @type {Number}
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
     * @type {Number}
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
     * @type {Number}
     */
    public get w(): number {
        return this.elements[3];
    }

    public set w(value: number) {
        this.elements[3] = value;
        this.fire('update');
    }

    mul(a : Quaternion, b : boolean){
        return this.multiply(a, b);
    }

    mulVec3(r : Vector3) : Quaternion{
        let w_ = -this.x * r.x - this.y * r.y - this.z * r.z;
		let x_ =  this.w * r.x + this.y * r.z - this.z * r.y;
		let y_ =  this.w * r.y + this.z * r.x - this.x * r.z;
		let z_ =  this.w * r.z + this.x * r.y - this.y * r.x;
		
		return new Quaternion(x_, y_, z_, w_);
    }

    len(){
        return this.length();
    }


    sqrLen(){
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