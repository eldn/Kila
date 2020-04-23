import { GameObject } from "../GameObject";
import { Matrix4 } from "../../math/Matrix4";
import { Frustum } from "../../math/Frustum";


const tempMatrix4 = new Matrix4();

export abstract class Camera extends GameObject {

     /**
     * 是否需要更新投影矩阵
     * @private
     * @default true
     * @type {Boolean}
     */
    protected _needUpdateProjectionMatrix: boolean = true;

    public get needUpdateProjectionMatrix(): boolean {
        return this._needUpdateProjectionMatrix;
    }
    
    public set needUpdateProjectionMatrix(value: boolean) {
        this._needUpdateProjectionMatrix = value;
    }


    protected _isGeometryDirty: boolean = false;

    public get isGeometryDirty(): boolean {
        return this._isGeometryDirty;
    }

    public set isGeometryDirty(value: boolean) {
        this._isGeometryDirty = value;
    }

     /**
     * 相对于摄像头的矩阵
     * @type {Matrix4}
     */
    private _viewMatrix: Matrix4;

    public get viewMatrix(): Matrix4 {
        return this._viewMatrix;
    }
    
    public set viewMatrix(value: Matrix4) {
        this._viewMatrix = value;
    }

     /**
     * 投影矩阵
     * @type {Matrix4}
     */
    private _projectionMatrix: Matrix4;

    public get projectionMatrix(): Matrix4 {
        return this._projectionMatrix;
    }

    public set projectionMatrix(value: Matrix4) {
        this._projectionMatrix = value;
    }

    private _viewProjectionMatrix: Matrix4;

    public get viewProjectionMatrix(): Matrix4 {
        return this._viewProjectionMatrix;
    }

    public set viewProjectionMatrix(value: Matrix4) {
        this._viewProjectionMatrix = value;
    }


    private _frustum : Frustum;

    /**
     * Creates a new camera.
     * @param name The name of this camera.
     * @param sceneGraph The scene graph to be used with this camera.
     */
    public constructor(name: string) {
        super(name);

        this._viewMatrix = new Matrix4();
        this._projectionMatrix = new Matrix4();
        this._viewProjectionMatrix = new Matrix4();
        this._frustum = new Frustum();
    }

    /**
     * 更新viewMatrix
     * @return {Camera} this
     */
    public updateViewMatrix() {
        this.updateWorldMatrix();
        this.viewMatrix.invert(this.worldMatrix);

        return this;
    }

    /**
     * 获取几何体，子类必须重写
     * @param  {Boolean} forceUpdate 是否强制更新
     * @return {Geometry}
     */
    getGeometry(forceUpdate) { // eslint-disable-line no-unused-vars

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
    public updateViewProjectionMatrix() {
        if (this._needUpdateProjectionMatrix) {
            this.updateProjectionMatrix();
            this._needUpdateProjectionMatrix = false;
        }
        this.updateViewMatrix();
        this.viewProjectionMatrix.multiply(this.projectionMatrix, this.viewMatrix);
        this.updateFrustum(this.viewProjectionMatrix);

        return this;
    }

    /**
     * 获取元素相对于当前Camera的矩阵
     * @param {Node} node 目标元素
     * @param {Matrix4} [out] 传递将在这个矩阵上做计算，不传将创建一个新的 Matrix4
     * @return {Matrix4} 返回获取的矩阵
     */
    public getModelViewMatrix(node, out) {
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
    public getModelProjectionMatrix(node, out) {
        out = out || new Matrix4();
        out.multiply(this.viewProjectionMatrix, node.worldMatrix);
        return out;
    }

    /**
     * 获取世界坐标系(三维)中一个点在画布(二维)上的位置
     * @param {Vector3} vector 点坐标
     * @param {number} [width] 画布宽，不传的话返回-1~1
     * @param {number} [height] 画布高，不传的话返回-1~1
     * @return {Vector3} 返回获取的坐标位置，如 { x: 0, y: 0 }
     */
    projectVector(vector, width, height) {
        const result = vector.clone();
        result.transformMat4(this.viewProjectionMatrix);
        if (width && height) {
            result.x = (result.x + 1) / 2 * width;
            result.y = height - (result.y + 1) / 2 * height;
        }
        return result;
    }


     /**
     * 屏幕坐标转换世界坐标系
     * @param {Vector3} vector 点坐标
     * @param {number} [width] 画布宽，传的话vector会认为是屏幕坐标
     * @param {number} [height] 画布高，传的话vector会认为是屏幕坐标
     * @return {Vector3} 返回世界坐标系(三维)中一个点
     */
    unprojectVector(vector, width, height) {
        const result = vector.clone();
        if (width && height) {
            result.x = result.x / width * 2 - 1;
            result.y = 1 - result.y / height * 2;
        }

        tempMatrix4.invert(this.viewProjectionMatrix);
        result.transformMat4(tempMatrix4);
        return result;
    }


     /**
     * mesh 是否摄像机可见
     * @param  {Mesh}  mesh
     * @return {Boolean}
     */
    isMeshVisible(mesh) {
        const geometry = mesh.geometry;
        if (geometry) {
            const sphere = geometry.getSphereBounds(mesh.worldMatrix);
            if (this._frustum.intersectsSphere(sphere)) {
                return true;
            }
        }
        return false;
    }


     /**
     * 更新 frustum
     * @param  {Matrix4} matrix
     * @return {Camera} this
     */
    updateFrustum(matrix) {
        this._frustum.fromMatrix(matrix);

        return this;
    }

    /** Returns the view for this camera. */
    public get view(): Matrix4 {
        return this.transform.getTransformationMatrix();
    }
}