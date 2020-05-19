import GameObject from "../core/GameObject";
import { Matrix4 } from "../math/Matrix4";

export class Camera extends GameObject{

    /**
     * 相对于摄像头的矩阵
     * @type {Matrix4}
     */
    viewMatrix : Matrix4;


    /**
     * 投影矩阵
     * @type {Matrix4}
     */
    projectionMatrix : Matrix4;

    /**
     * View 联结投影矩阵
     * @type {Matrix4}
     */
    viewProjectionMatrix : Matrix4;



    /**
     * 是否需要更新投影矩阵
     * @private
     * @default true
     * @type {Boolean}
     */
    _needUpdateProjectionMatrix: boolean = true;

    constructor(){
        super();

        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
        this.viewProjectionMatrix = new Matrix4();
    }


    /**
     * 更新viewMatrix
     * @return {Camera} this
     */
    updateViewMatrix() {
        this.updateMatrixWorld(true);
        this.viewMatrix.invert(this.worldMatrix);
        return this;
    }

    /**
     * 更新投影矩阵，子类必须重载这个方法
     */
    updateProjectionMatrix() {

    }

    /**
     * 更新viewProjectionMatrix
     * @return {Camera} this
     */
    updateViewProjectionMatrix() {
        if (this._needUpdateProjectionMatrix) {
            this.updateProjectionMatrix();
            this._needUpdateProjectionMatrix = false;
        }
        this.updateViewMatrix();
        this.viewProjectionMatrix.multiply(this.projectionMatrix, this.viewMatrix);
        return this;
    }

     /**
     * 获取元素相对于当前Camera的矩阵
     * @param {Node} node 目标元素
     * @param {Matrix4} [out] 传递将在这个矩阵上做计算，不传将创建一个新的 Matrix4
     * @return {Matrix4} 返回获取的矩阵
     */
    getModelViewMatrix(node : GameObject, out ?: Matrix4) {
        out = out || new Matrix4();
        out.multiply(this.viewMatrix, node.worldMatrix);
        return out;
    }

    /**
     * 获取元素的投影矩阵
     * @param {Node} node 目标元素
     * @param {Matrix4} [out] 传递将在这个矩阵上做计算，不传将创建一个新的 Matrix4
     * @return {Matrix4} 返回获取的矩阵
     */
    getModelProjectionMatrix(node : GameObject, out ?: Matrix4) {
        out = out || new Matrix4();
        out.multiply(this.viewProjectionMatrix, node.worldMatrix);
        return out;
    }
    
}