
import { mat3 } from "gl-matrix";
import { Vector2, Quaternion, Matrix4 } from ".";

export class Matrix3{

    /**
     * 数据
     */
    public elements : mat3 = mat3.create();
    
     /**
     * Creates a new identity mat3
     */
    constructor() {
       
    }

    public getClassName() : string{
        return "Matrix3";
    }

    /**
     * Copy the values from one mat3 to this
     * @param  m the source matrix
     * @returns this
     */
    public copy(m : Matrix3) : Matrix3 {
        mat3.copy(this.elements, m.elements);
        return this;
    }

    /**
     * Creates a new mat3 initialized with values from this matrix
     * @returns a new Matrix3
     */
    public clone() : Matrix3 {
        const m = new Matrix3();
        mat3.copy(m.elements, this.elements);
        return m;
    }

    /**
     * 转换到数组
     * @param  array 数组
     * @param  offset 数组偏移值
     * @returns
     */
    public toArray(array : Array<number> = [], offset : number = 0) : Array<number>{
        const elements = this.elements;
        for (let i = 0; i < 9; i++) {
            array[offset + i] = elements[i];
        }
        return array;
    }

    /**
     * 从数组赋值
     * @param  array  数组
     * @param  offset数组偏移值
     * @returns this
     */
    public fromArray(array : Array<number>, offset : number = 0) : Matrix3 {
        const elements = this.elements;
        for (let i = 0; i < 9; i++) {
            elements[i] = array[offset + i];
        }
        return this;
    }

    /**
     * Set the components of a mat3 to the given values
     * @param m00
     * @param  m01
     * @param m02
     * @param m10
     * @param m11
     * @param  m12
     * @param  m20
     * @param m21
     * @param m22
     * @return  this
     */
    public set(m00 : number, m01 : number, m02 : number, m10 : number, m11 : number, m12 : number, m20 : number, m21 : number, m22 : number) : Matrix3 {
        mat3.set(this.elements, m00, m01, m02, m10, m11, m12, m20, m21, m22);
        return this;
    }

    /**
     * Set this to the identity matrix
     * @returnsthis
     */
    public identity() : Matrix3{
        mat3.identity(this.elements);
        return this;
    }

    /**
     * Transpose the values of this
     * @returns this
     */
    public transpose() : Matrix3 {
        mat3.transpose(this.elements, this.elements);
        return this;
    }

    /**
     * invert a matrix
     * @param  m
     * @returns this
     */
    public invert(m : Matrix3 = this) : Matrix3 {
        mat3.invert(this.elements, m.elements);
        return this;
    }

    /**
     * Calculates the adjugate of a mat3
     * @param  {Matrix3} [m=this]
     * @return {Matrix3} this
     */
    public adjoint(m : Matrix3 = this) : Matrix3 {
        mat3.adjoint(this.elements, m.elements);
        return this;
    }

    /**
     * Calculates the determinant of this
     * @returns
     */
    public determinant() : number {
        return mat3.determinant(this.elements);
    }

    /**
     * Multiplies two matrix3's
     * @param   a
     * @param  b如果不传，计算 this 和 a 的乘积
     * @returns this
     */
    public multiply(a : Matrix3, b ?: Matrix3) : Matrix3{
        if (!b) {
            b = a;
            a = this;
        }
        mat3.multiply(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * 左乘
     * @param  m
     * @returns  this
     */
    public premultiply(m : Matrix3) : Matrix3 {
        this.multiply(m, this);
        return this;
    }

    /**
     * Translate this by the given vector
     * @param v vector to translate by
     * @returns this
     */
    public translate(v : Vector2) : Matrix3 {
        mat3.translate(this.elements, this.elements, v.elements);
        return this;
    }

    /**
     * Rotates this by the given angle
     * @param  rad the angle to rotate the matrix by
     * @returns  this
     */
    public rotate(rad : number) : Matrix3 {
        mat3.rotate(this.elements, this.elements, rad);
        return this;
    }

    /**
     * Scales the mat3 by the dimensions in the given vec2
     * @param  v the vec2 to scale the matrix by
     * @returns  this
     */
    public scale(v : Vector2) : Matrix3{
        mat3.scale(this.elements, this.elements, v.elements);
        return this;
    }

    /**
     * Creates a matrix from a vector translation
     * @param   v Translation vector
     * @returns  this
     */
    public fromTranslation(v : Vector2) :  Matrix3{
        mat3.fromTranslation(this.elements, v.elements);
        return this;
    }

    /**
     * Creates a matrix from a given angle
     * @param   rad the angle to rotate the matrix by
     * @return this
     */
    public fromRotation(rad : number) : Matrix3 {
        mat3.fromRotation(this.elements, rad);
        return this;
    }

    /**
     * Creates a matrix from a vector scaling
     * @param v Scaling vector
     * @returns this
     */
    public fromScaling(v : Vector2) : Matrix3{
        mat3.fromScaling(this.elements, v.elements);
        return this;
    }
    /**
     * Calculates a 3x3 matrix from the given quaternion
     * @param  q Quaternion to create matrix from
     * @return  this
     */
    public fromQuat(q : Quaternion) : Matrix3 {
        mat3.fromQuat(this.elements, q.elements);
        return this;
    }

    /**
     * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
     * @param  m Mat4 to derive the normal matrix from
     * @return this
     */
    public normalFromMat4(m : Matrix4) : Matrix3 {
        mat3.normalFromMat4(this.elements, m.elements);
        return this;
    }

    /**
     * Copies the upper-left 3x3 values into the given mat3.
     * @param   m the source 4x4 matrix
     * @return  this
     */
    public fromMat4(m : Matrix4) :Matrix3  {
        mat3.fromMat4(this.elements, m.elements);
        return this;
    }

    /**
     * Returns Frobenius norm of this
     * @return  Frobenius norm
     */
    public frob() : number {
        return mat3.frob(this.elements);
    }
    /**
     * Adds two mat3's
     * @param  a
     * @param b 如果不传，计算 this 和 a 的和
     * @return  this
     */
    public add(a : Matrix3, b ?: Matrix3) : Matrix3 {
        if (!b) {
            b = a;
            a = this;
        }
        mat3.add(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Subtracts matrix b from matrix a
     * @param a
     * @param b 如果不传，计算 this 和 a 的差
     * @return  this
     */
    public subtract(a : Matrix3, b ?: Matrix3) : Matrix3 {
        if (!b) {
            b = a;
            a = this;
        }
        mat3.subtract(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     * @param  a
     * @param b 如果不传，比较 this 和 a 是否相等
     * @return 
     */
    public exactEquals(a : Matrix3, b ?: Matrix3) : Boolean {
        if (!b) {
            b = a;
            a = this;
        }
        return mat3.exactEquals(a.elements, b.elements);
    }

    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     * @param  a
     * @param b 如果不传，比较 this 和 a 是否近似相等
     * @return 
     */
    public equals(a : Matrix3, b : Matrix3) : boolean {
        if (!b) {
            b = a;
            a = this;
        }
        return mat3.equals(a.elements, b.elements);
    }

    /**
     * fromRotationTranslationScale
     * @param   r rad angle
     * @param   x
     * @param   y
     * @param  scaleX
     * @param   scaleY
     * @return 
     */
    public fromRotationTranslationScale(rotation : number, x : number, y : number, scaleX : number, scaleY : number) : Matrix3{
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);

        this.set(scaleX * cos, -scaleY * sin, 0, scaleX * sin, scaleY * cos, 0, x, y, 1);
        return this;
    }


    public sub(a : Matrix3, b ?: Matrix3) : Matrix3{
        return this.subtract(a, b);
    }


    public mul(a : Matrix3, b ?: Matrix3) : Matrix3{
        return this.multiply(a, b);
    }
}