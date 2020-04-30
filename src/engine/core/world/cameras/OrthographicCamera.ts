import { Camera } from "./Camera";
import { Geometry } from "../geometry/Geometry";

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


    private _geometry : Geometry;

    getGeometry(forceUpdate ?: boolean) : Geometry{
        if (forceUpdate || !this._geometry || this._isGeometryDirty) {
            this._isGeometryDirty = false;

            const geometry = new Geometry();

            const p1 = [this.left, this.bottom, -this.near];
            const p2 = [this.right, this.bottom, -this.near];
            const p3 = [this.right, this.top, -this.near];
            const p4 = [this.left, this.top, -this.near];
            const p5 = [this.left, this.bottom, -this.far];
            const p6 = [this.right, this.bottom, -this.far];
            const p7 = [this.right, this.top, -this.far];
            const p8 = [this.left, this.top, -this.far];

            geometry.addRect(p5, p6, p7, p8); // front
            geometry.addRect(p6, p2, p3, p7); // right
            geometry.addRect(p2, p1, p4, p3); // back
            geometry.addRect(p1, p5, p8, p4); // left
            geometry.addRect(p8, p7, p3, p4); // top
            geometry.addRect(p1, p2, p6, p5); // bottom

            this._geometry = geometry;
        }

        return this._geometry;
    }

}