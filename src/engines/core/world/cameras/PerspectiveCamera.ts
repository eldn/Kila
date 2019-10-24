// https://learnopengl.com/code_viewer_gh.php?code=includes/learnopengl/camera.h
import { BaseCamera } from "./BaseCamera";
import { SceneGraph } from "../SceneGraph";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { Vector3 } from "../../math/Vector3";
import { Vector2 } from "../../math/Vector2";

export class PerspectiveCamera extends BaseCamera {

    private _front : Vector3 = new Vector3(0, 0, -1);
    private _up : Vector3 = new Vector3(0, 1, 0);
    private _viewMat : Matrix4x4 = Matrix4x4.identity();

    public constructor(name: string, sceneGraph?: SceneGraph) {
        super(name, sceneGraph);
    }

    public get view(): Matrix4x4 {
        let viewMat : Matrix4x4 = this.transform.getTransformationMatrix();
        return viewMat;
        
        // return Matrix4x4.lookAt(this._viewMat, this.transform.position, Vector3.add(this.transform.position, this._front), this._up);
    }
}