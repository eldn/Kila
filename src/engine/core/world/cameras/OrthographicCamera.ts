import { Camera } from "./Camera";

export class OrthographicCamera extends Camera{

    _left:  number = -1;

    /**
     * @default -1
     * @type {number}
     */
    get left() : number {
        return this._left;
    }

    set left(value : number) {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._left = value;
    }
    
    _right: number = 1;

     /**
     * @default 1
     * @type {number}
     */
    get right() : number {
        return this._right;
    }

    set right(value : number) {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._right = value;
    }

    _bottom: number = -1;

    /**
     * @default -1
     * @type {number}
     */
    get bottom() : number{
        return this._bottom;
    }

    set bottom(value : number) {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._bottom = value;
    }
    
    _top: number = 1;

    /**
     * @default 1
     * @type {number}
     */
    get top() : number{
        return this._top;
    }

    set top(value : number) {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._top = value;
    }

    _near: number = 0.1;

    /**
     * @default 0.1
     * @type {number}
     */
    get near() : number{
        return this._near;
    }
    
    set near(value : number)  {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._near = value;
    }
    
    _far: number = 1;

    /**
     * @default 1
     * @type {number}
     */
    get far() {
        return this._far;
    }
    
    set far(value) {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._far = value;
    }
    
    /**
     * @constructs
     * @param {object} params 创建对象的属性参数。可包含此类的所有属性。
     */
    constructor() {
        super("");
        this.updateProjectionMatrix();
    }

     /**
     * 更新投影矩阵
     */
    updateProjectionMatrix() {
        this.projectionMatrix.ortho(this.left, this.right, this.bottom, this.top, this.near, this.far);
    }

}