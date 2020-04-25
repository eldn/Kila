// https://learnopengl.com/code_viewer_gh.php?code=includes/learnopengl/camera.h
import { Camera } from "./Camera";
import { Vector3 } from "../../math/Vector3";
import { Matrix4 } from "../../math/Matrix4";
import math from "../../math/math";
import { KEY_CODE_MACRO } from "../../define/Macro";

export class PerspectiveCamera extends Camera {
    
    private _mouseSensitivity : number = 0.01;
    private _movementSpeed : number = 2.5;


    
    public constructor(name: string) {
        super(name);
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

    public processMouseMovement(xoffset : number, yoffset : number, constrainPitch : boolean = true) : void{
        xoffset *= this._mouseSensitivity;
        yoffset *= this._mouseSensitivity;

        // this.transform.rotationX += xoffset;
        // this.transform.rotationY += yoffset;

        console.log("xoffset:" +xoffset, ",yoffset:" + yoffset);

    }

    public processKeyboard(keyCode : number, deltaTime : number) : void{
        let velocity : number = this._movementSpeed * deltaTime / 1000;
        if (keyCode == KEY_CODE_MACRO.w)
            this.move(this.transform.quaternion.getBack(), velocity);
        if (keyCode == KEY_CODE_MACRO.s)
            this.move(this.transform.quaternion.getForward(), velocity);
        if (keyCode == KEY_CODE_MACRO.a)
            this.move(this.transform.quaternion.getLeft(), velocity);
        if (keyCode == KEY_CODE_MACRO.d)
            this.move(this.transform.quaternion.getRight(), velocity);

        // this._isDirty = true;
    }

    private move(dir : Vector3, amt : number){
        this.transform.position.add(dir.scale(amt));
    }

    

    public processMouseScroll(yoffset : number) : void{
        let angel: number = this._fov / (Math.PI / 180);
        let sensitivity: number = 0.1;
  
        if (angel >= 1.0 && angel <= 45.0)
          angel -= yoffset * sensitivity;
  
        if (angel <= 1.0)
          angel = 1.0;
  
        if (angel >= 45.0)
          angel = 45.0;
  
        this._fov = angel * (Math.PI / 180); 
    }

}