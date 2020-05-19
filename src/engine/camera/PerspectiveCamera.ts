import { Camera } from "./Camera";
import math from "../math/math";


export class PerspectiveCamera extends Camera {


    
    public constructor() {
        super();
        this.updateProjectionMatrix();
    }



    private _near: number = 0.1;

    public get near(): number {
        return this._near;
    }

    public set near(value: number) {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._near = value;
    }

    private _far: number = 1000.0;

    public get far(): number {
        return this._far;
    }

    public set far(value: number) {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._far = value;
    }

    private _fov: number = 50;

    public get fov(): number {
        return this._fov;
    }

    public set fov(value: number) {
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._fov = value;
    }


    private _aspect: number = 1;

    public get aspect(): number {
        return this._aspect;
    }

    public set aspect(value: number) {
        this._aspect = value;
        this._needUpdateProjectionMatrix = true;
        this._isGeometryDirty = true;
        this._aspect = value;
    }

    /**
     * 更新投影矩阵
     */
    updateProjectionMatrix() {

        const elements = this.projectionMatrix.elements;
        const {
            near,
            far,
            aspect,
            fov
        } = this;
        const f = 1 / Math.tan(0.5 * math.degToRad(fov));

        elements[0] = f / aspect;
        elements[5] = f;
        elements[11] = -1;
        elements[15] = 0;

        if (far) {
            const nf = 1 / (near - far);
            elements[10] = (near + far) * nf;
            elements[14] = 2 * far * near * nf;
        } else {
            elements[10] = -1;
            elements[14] = -2 * near;
        }
    }

    public radians(degrees: number): number {
        return degrees * (Math.PI / 180.0);
    }
}