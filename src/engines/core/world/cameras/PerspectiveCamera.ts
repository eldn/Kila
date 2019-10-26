// https://learnopengl.com/code_viewer_gh.php?code=includes/learnopengl/camera.h
import { BaseCamera } from "./BaseCamera";
import { SceneGraph } from "../SceneGraph";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { Vector3 } from "../../math/Vector3";

let v3_a : Vector3 = new Vector3();
let m4_a : Matrix4x4 = Matrix4x4.identity();


export class PerspectiveCamera extends BaseCamera {
    

    private _forward: Vector3 = new Vector3(0, 0, 0);
    public get forward(): Vector3 {
        return new Vector3(this._forward.x, this._forward.y, this._forward.z);
    }
    public set forward(value: Vector3) {
        this._forward.copyFrom(value);
    }

    private _up: Vector3 = new Vector3(0, 1, 0);
    public get up(): Vector3 {
        return this._up;
    }
    public set up(value: Vector3) {
        this._up = value;
    }

    public constructor(name: string, sceneGraph?: SceneGraph, forward : Vector3 = new Vector3(0, 0, 0), up : Vector3 = new Vector3(0, 1, 0)) {
        super(name, sceneGraph);

        this.forward = forward.normalize();
        this.up = up.normalize();
    }

    /**
     * TODO 先不考虑摄像机的旋转
     */
    public get view(): Matrix4x4 {
        // return this.transform.getTransformationMatrix();
        return Matrix4x4.lookAt(m4_a, this.getWorldPosition(), this.forward, this._up);
    }


}