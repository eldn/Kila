// https://learnopengl.com/code_viewer_gh.php?code=includes/learnopengl/camera.h
import { Camera } from "./Camera";
import math from "../../math/math";
import { Geometry } from "../geometry/Geometry";

export class PerspectiveCamera extends Camera {


    
    public constructor(name ?: string, apsect ?: number, near ?: number, far ?: number, fov ?: number) {
        super(name);

        apsect && (this._aspect = apsect);
        near && (this._near = near);
        far && (this._far = far);
        fov && (this._fov = fov);
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


    public update(time: number): void {
        super.update(time);
    }

    public radians(degrees: number): number {
        return degrees * (Math.PI / 180.0);
    }


    private _geometry : Geometry;

    getGeometry(forceUpdate ?: boolean) : Geometry{
        if (forceUpdate || !this._geometry || this._isGeometryDirty) {
            this._isGeometryDirty = false;

            const geometry = new Geometry();
            const tan = Math.tan(this.fov / 2 * Math.PI / 180);
            const near = this.near;
            const far = this.far;
            const vNear = near * tan;
            const vFar = far * tan;
            const hNear = this.aspect * vNear;
            const hFar = this.aspect * vFar;

            const p1 = [-hNear, -vNear, -near];
            const p2 = [hNear, -vNear, -near];
            const p3 = [hNear, vNear, -near];
            const p4 = [-hNear, vNear, -near];

            const p5 = [-hFar, -vFar, -far];
            const p6 = [hFar, -vFar, -far];
            const p7 = [hFar, vFar, -far];
            const p8 = [-hFar, vFar, -far];

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