import GameObject from "../core/GameObject";
import { Matrix4 } from "../math/Matrix4";

export abstract class Camera extends GameObject{

   /**
    * 相对于摄像头的矩阵
    *
    */
   private _viewMatrix : Matrix4;


    /**
     * 投影矩阵
     *
     */
    protected _projectionMatrix : Matrix4;

    /**
     * View 联结投影矩阵
     *
     */
    public viewProjectionMatrix : Matrix4;


    /**
     *是否需要更新投影矩阵
     *
     */
    protected _needUpdateProjectionMatrix: boolean = true;


    protected _isGeometryDirty : boolean = false;

    public getClassName() : string{
        return "Camera";
    }

    constructor(){
        super();

        this._viewMatrix = new Matrix4();
        this._projectionMatrix = new Matrix4();
        this.viewProjectionMatrix = new Matrix4();
    }


    /**
     * 更新viewMatrix
     * @returns this
     */
    public updateViewMatrix() : Camera{
        this.updateMatrixWorld(true);
        this._viewMatrix.invert(this.worldMatrix);
        return this;
    }

    /**
     * 更新投影矩阵，子类必须重载这个方法
     */
    public abstract updateProjectionMatrix() : void;

    /**
     * 更新viewProjectionMatrix
     * @returns this
     */
    public updateViewProjectionMatrix() : Camera{
        if (this._needUpdateProjectionMatrix) {
            this.updateProjectionMatrix();
            this._needUpdateProjectionMatrix = false;
        }
        this.updateViewMatrix();
        this.viewProjectionMatrix.multiply(this._projectionMatrix, this._viewMatrix);
        return this;
    }

     /**
     * 获取元素相对于当前Camera的矩阵
     * @param node 目标元素
     * @param out 传递将在这个矩阵上做计算，不传将创建一个新的 Matrix4
     * @returns 返回获取的矩阵
     */

    public getModelViewMatrix(node : GameObject, out ?: Matrix4) : Matrix4{
        out = out || new Matrix4();
        out.multiply(this._viewMatrix, node.worldMatrix);
        return out;
    }

    /**
     * 获取元素的投影矩阵
     * @param  node 目标元素
     * @param  out 传递将在这个矩阵上做计算，不传将创建一个新的 Matrix4
     * @returns 返回获取的矩阵
     */
    public getModelProjectionMatrix(node : GameObject, out ?: Matrix4) : Matrix4 {
        out = out || new Matrix4();
        out.multiply(this.viewProjectionMatrix, node.worldMatrix);
        return out;
    }
    
}