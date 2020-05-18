
import { Quaternion } from "./Quaternion";
import { Matrix4Notifier } from "./Matrix4Notifier";
import { Vector3Notifier } from "./Vector3Notifier";
import { EulerNotifier } from "./EulerNotifier";
import { Matrix4 } from "./Matrix4";
import { Vector3 } from "./Vector3";
import { log } from "../utils/Log";

const defaultUp = new Vector3(0, 1, 0);
const tempMatrix4 = new Matrix4();

export class Transform{


    private _quatDirty: boolean = false;
    private _matrixDirty: boolean = false;


     /**
     * 元素的up向量
     * @type {Vector3}
     */
    public up : Vector3;

    constructor(){

         
        this.up = defaultUp.clone();

        this._matrix.on('update',this._onMatrixUpdate.bind(this));
        this._position.on('update',this._onPositionUpdate.bind(this));
        this._scale.on('update', this._onScaleUpdate.bind(this));
        this._pivot.on('update', this._onPivotUpdate.bind(this));
        this._rotation.on('update', this._onRotationUpdate.bind(this));
        this._quaternion.on('update', this._onQuaternionUpdate.bind(this));
    }

      /**
     * 设置元素的缩放比例
     * @param {number} x X缩放比例
     * @param {number} y Y缩放比例
     * @param {number} z Z缩放比例
     * @return {Node} this
     */
    public setScale(x :number, y : number = x, z : number = y) {
        this._scale.set(x, y, z);
        return this;
    }

     /**
     * 设置元素的位置
     * @param {number} x X方向位置
     * @param {number} y Y方向位置
     * @param {number} z Z方向位置
     * @return {Node} this
     */
    public setPosition(x : number, y : number, z :number) {
        this._position.set(x, y, z);
        return this;
    }


    /**
     * 设置元素的旋转
     * @param {number} x X轴旋转角度, 角度制
     * @param {number} y Y轴旋转角度, 角度制
     * @param {number} z Z轴旋转角度, 角度制
     * @return {Node} this
     */
    public setRotation(x : number, y : number, z :number) {
        this._rotation.setDegree(x, y, z);
        return this;
    }

    /**
     * 设置中心点
     * @param {Number} x 中心点x
     * @param {Number} y 中心点y
     * @param {Number} z 中心点z
     * @return {Node} this
     */
    public setPivot(x : number, y :number, z : number) {
        this._pivot.set(x, y, z);
        return this;
    }


    // /**
    //  * 改变元素的朝向
    //  * @param {Node|Object|Vector3} node 需要朝向的元素，或者坐标
    //  * @return {Node} this
    //  */
    // public lookAt(node : GameObject) {
    //     if (node instanceof Camera) {
    //         tempMatrix4.targetTo(this, node, this.up);
    //     } else {
    //         tempMatrix4.targetTo(node, this, this.up);
    //     }
    //     this._quaternion.fromMat4(tempMatrix4);
    //     return this;
    // }


    private _matrix: Matrix4Notifier = new Matrix4Notifier();


    /** =====================> position <=========================== */

    private _position: Vector3Notifier = new Vector3Notifier();

    public get position(): Vector3Notifier {
        return this._position;
    }

    public set position(value: Vector3Notifier) {
        log.warnOnce('Node.position.set', 'node.position is readOnly.Use node.position.copy instead.');
        this._position.copy(value);
    }

     /**
     * x轴坐标
     * @type {number}
     */
  
    get x() : number{
        return this._position.elements[0];
    }

    set x(value :number) {
        this._position.elements[0] = value;
        this._matrixDirty = true;
    }

    /**
     * y轴坐标
     * @type {number}
     */
    get y() : number {
        return this._position.elements[1];
    }

    set y(value : number) {
        this._position.elements[1] = value;
        this._matrixDirty = true;
    }

     /**
     * z轴坐标
     * @type {number}
     */
    get z() : number{
        return this._position.elements[2];
    }

    set z(value : number) {
        this._position.elements[2] = value;
        this._matrixDirty = true;
    }
     /** =====================> position <=========================== */

    /** =====================> scale <=========================== */
    private _scale: Vector3Notifier = new Vector3Notifier(1, 1, 1);

    public get scale(): Vector3Notifier {
        return this._scale;
    }

    public set scale(value: Vector3Notifier) {
        log.warnOnce('Node.scale.set', 'node.scale is readOnly.Use node.scale.copy instead.');
        this._scale.copy(value);
    }

    
     /**
     * 缩放比例x
     * @type {number}
     */
    get scaleX() {
        return this._scale.elements[0];
    }

    set scaleX(value) {
        this._scale.elements[0] = value;
        this._matrixDirty = true;
    }
    
     /**
     * 缩放比例y
     * @type {number}
     */
    get scaleY() {
        return this._scale.elements[1];
    }

    set scaleY(value) {
        this._scale.elements[1] = value;
        this._matrixDirty = true;
    }

    /**
     * 缩放比例z
     * @type {number}
     */
    get scaleZ() {
        return this._scale.elements[2];
    }

    set scaleZ(value) {
        this._scale.elements[2] = value;
        this._matrixDirty = true;
    }

    /** =====================> scale <=========================== */

    

    /** =====================> pivot: <=========================== */
    private _pivot: Vector3Notifier = new Vector3Notifier(0, 0, 0);

    public get pivot(): Vector3Notifier {
        return this._pivot;
    }

    public set pivot(value: Vector3Notifier) {
        log.warnOnce('Node.pivot.set', 'node.pivot is readOnly.Use node.pivot.copy instead.');
        this._pivot.copy(value);
    }

     /**
     * 中心点x
     * @type {Number}
     */
    get pivotX() {
        return this._pivot.elements[0];
    }

    set pivotX(value) {
        this._pivot.elements[0] = value;
        this._matrixDirty = true;
    }
    
    /**
     * 中心点y
     * @type {Number}
     */
    get pivotY() {
        return this._pivot.elements[1];
    }

    set pivotY(value) {
        this._pivot.elements[1] = value;
        this._matrixDirty = true;
    }
    
    /**
     * 中心点z
     * @type {Number}
     */
    get pivotZ() {
        return this._pivot.elements[2];
    }

    set pivotZ(value) {
        this._pivot.elements[2] = value;
        this._matrixDirty = true;
    }
    
     /** =====================> pivot <=========================== */
  


    /** =====================> rotation <=========================== */
    private _rotation: EulerNotifier = new EulerNotifier();

    public get rotation(): EulerNotifier {
        return this._rotation;
    }

    public set rotation(value: EulerNotifier) {
        log.warnOnce('Node.rotation.set', 'node.rotation is readOnly.Use node.rotation.copy instead.');
        this._rotation.copy(value);
    }

     /**
     * 旋转角度 x, 角度制
     * @type {number}
     */
    get rotationX() {
        return this._rotation.degX;
    }

    set rotationX(value) {
        this._rotation.degX = value;
    }
    
    /**
     * 旋转角度 y, 角度制
     * @type {number}
     */
    get rotationY() {
        return this._rotation.degY;
    }

    set rotationY(value) {
        this._rotation.degY = value;
    }
    
    /**
     * 旋转角度 z, 角度制
     * @type {number}
     */
    get rotationZ() {
        return this._rotation.degZ;
    }

    set rotationZ(value) {
        this._rotation.degZ = value;
    }


    /** =====================> rotation <=========================== */


    /** =====================> quaternion <=========================== */

    private _quaternion: Quaternion = new Quaternion();

    public get quaternion(): Quaternion {
        this.updateQuaternion();
        return this._quaternion;
    }

    public set quaternion(value: Quaternion) {
        log.warnOnce('Node.quaternion.set', 'node.quaternion is readOnly.Use node.quaternion.copy instead.');
        this._quaternion.copy(value);
    }


    /** =====================> quaternion <=========================== */


 
    public copyFrom(transform: Transform): void {
        this.position.copy(transform.position);
        this.rotation.copy(transform.rotation);
        this.scale.copy(transform.scale);
    }

   private _onMatrixUpdate() {
        this.updateTransform();
    }

    private _onPositionUpdate() {
        this._matrixDirty = true;
    }

    private _onScaleUpdate() {
        this._matrixDirty = true;
    }

    private _onPivotUpdate() {
        this._matrixDirty = true;
    }

    private _onRotationUpdate() {
        this._quatDirty = true;
        this._matrixDirty = true;
    }

    _onQuaternionUpdate() {
        this._rotation.fromQuat(this._quaternion);
        this._quatDirty = false;
    }


     /**
     * 元素的矩阵
     * @type {Matrix4Notifier}
     * @readOnly
     */
    get matrix() : Matrix4Notifier {
        this.updateMatrix();
        return this._matrix;
    }
    
    set matrix(value : Matrix4Notifier) {
        log.warnOnce('Node.matrix.set', 'node.matrix is readOnly.Use node.matrix.copy instead.');
        this._matrix.copy(value);
    }

     /**
     * 更新本地矩阵
     * @return {Node} this
     */
    updateMatrix() {
        if (this._matrixDirty) {
            this._matrixDirty = false;
            this._matrix.fromRotationTranslationScaleOrigin(this.quaternion, this._position, this._scale, this._pivot, true);
        }

        return this;
    }

    /**
     * 更新四元数
     * @return {Node} this
     */
    updateQuaternion() {
        if (this._quatDirty) {
            this._quatDirty = false;
            this._quaternion.fromEuler(this._rotation, true);
        }

        return this;
    }
    

     /**
     * 更新transform属性
     * @return {Node} this
     */
    updateTransform() {
        this._matrix.decompose(this._quaternion, this._position, this._scale, this._pivot);
        this._onQuaternionUpdate();

        this._matrixDirty = false;
        return this;
    }
}