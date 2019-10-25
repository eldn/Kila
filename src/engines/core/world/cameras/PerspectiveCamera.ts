// https://learnopengl.com/code_viewer_gh.php?code=includes/learnopengl/camera.h
import { BaseCamera } from "./BaseCamera";
import { SceneGraph } from "../SceneGraph";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { Vector3 } from "../../math/Vector3";
import { Vector2 } from "../../math/Vector2";
import { Renderer } from "../../renderer/Renderer";

let v3_a : Vector3 = new Vector3();
const yAxis : Vector3 = new Vector3(0,1,0);

export class PerspectiveCamera extends BaseCamera {
    


    private _forward: Vector3 = new Vector3(0, 0, 1);
    public get forward(): Vector3 {
        return this._forward;
    }
    public set forward(value: Vector3) {
        this._forward = value;
    }

    private _up: Vector3 = new Vector3(0, 1, 0);
    public get up(): Vector3 {
        return this._up;
    }
    public set up(value: Vector3) {
        this._up = value;
    }

    public constructor(name: string, sceneGraph?: SceneGraph, forward : Vector3 = new Vector3(0, 0, 1), up : Vector3 = new Vector3(0,1,0)) {
        super(name, sceneGraph);

        this.forward = forward.normalize();
        this.up = up.normalize();
    }

    public get view(): Matrix4x4 {
        let viewMat : Matrix4x4 = this.transform.getTransformationMatrix();
        return viewMat;
        
        // return Matrix4x4.lookAt(this._viewMat, this.transform.position, Vector3.add(this.transform.position, this._front), this._up);
    }

    public getProjectedTransfomation() : Matrix4x4{

        let transformationMatrix : Matrix4x4 = this.transform.getTransformationMatrix();
        let projectionMatrix : Matrix4x4 = Renderer.getProjection();
        
        let cameraRotation : Matrix4x4;
        let cameraTranslation : Matrix4x4 = Matrix4x4.translation(new Vector3(-this.transform.position.x, -this.transform.position.y, -this.transform.position.z));

        return Matrix4x4.multiply(projectionMatrix, Matrix4x4.multiply(cameraRotation, Matrix4x4.multiply(cameraTranslation, transformationMatrix)));
    }

    public move(dir : Vector3, amt : number) : void{
        this.transform.position.add(dir.multiplyValue(amt));
    }

    public getLeft() : Vector3{
        let left : Vector3 = Vector3.cross(v3_a, this.up, this.forward);
        left.normalize();
        return left;
    }

    public getRight() : Vector3{
        let right : Vector3 = Vector3.cross(v3_a, this.forward, this.up);
        right.normalize();
        return right;
    }

    public rotateX(angle : number) : void{
        let Haxis : Vector3 = Vector3.cross(v3_a, yAxis, this.forward);
        Haxis.normalize();

        this.forward.rotate(angle, Haxis);
        this.forward.normalize();

        this.up = Vector3.cross(v3_a, this.forward, Haxis);
        this.up.normalize();
    }

    public rotateY(angle : number) : void{
        let Haxis : Vector3 = Vector3.cross(v3_a, yAxis, this.forward);
        Haxis.normalize();

        this.forward.rotate(angle, yAxis);
        this.forward.normalize();

        this.up = Vector3.cross(v3_a, this.forward, Haxis);
        this.up.normalize();
    }

    public getPos() : Vector3{
        return new Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z);
    }

}