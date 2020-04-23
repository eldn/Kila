// https://learnopengl.com/code_viewer_gh.php?code=includes/learnopengl/camera.h
import { Camera } from "./Camera";
import { SceneGraph } from "../SceneGraph";
import { Vector3 } from "../../math/Vector3";
import { Vector2 } from "../../math/Vector2";
import { KEY_CODE_MACRO } from "../../define/Macro";
import { Renderer } from "../../renderering/Renderer";
import { Matrix4 } from "../../math/Matrix4";

let v3_a : Vector3 = new Vector3();
let m4_a : Matrix4 = new Matrix4();

export class PerspectiveCamera extends Camera {
    
    private _isDirty : boolean = false;
    private _viewMat : Matrix4 = new Matrix4();
    private _mouseSensitivity : number = 0.1;
    private _movementSpeed : number = 2.5;

    /**
     * 看的方向
     */
    private _front: Vector3 = new Vector3(0, 0, 0);

    public get front() : Vector3{
        return (new Vector3()).copy(this._front);
    }

    public getFront(out : Vector3) : Vector3{
        out.copy(this._front);
        return out;
    }

    private _worldUp: Vector3 = new Vector3(0, 1, 0);
    public get worldUp(): Vector3 {
        return this._worldUp;
    }

    public set worldUp(value: Vector3) {
        if(!this.worldUp.equals(value)){
            this._worldUp = value;
            this._isDirty = true;
        }
    }

    private _up: Vector3 = new Vector3();

    public get up(): Vector3 {
        return this._up;
    }
    public set up(value: Vector3) {
        if(!this._up.equals(value)){
            this._up = value;
            this._isDirty = true;
        }
    }

    // Euler Angles
    private _yaw: number;

    public get yaw(): number {
        return this._yaw;
    }

    public set yaw(value: number) {
        if(this.yaw != value){
            this._yaw = value;
            this._isDirty = true;
        }
    }

    private _pitch: number;

    public get pitch(): number {
        return this._pitch;
    }

    public set pitch(value: number) {
        if(this._pitch != value){
            this._pitch = value;
            this._isDirty = true;
        }
    }

    private _right: Vector3 = new Vector3();

    public get right(): Vector3 {
        return this._right;
    }
    public set right(value: Vector3) {
        if(!this._right.equals(value)){
            this._right = value;
            this._isDirty = true;
        }
    }

    public constructor(name: string, front : Vector3 = new Vector3(0, 0, -1), worldUp : Vector3 = new Vector3(0, 1, 0), pitch : number = 0, yaw : number = -90) {
        super(name);

        this._front = front.normalize();
        this._worldUp = worldUp.normalize();
        this._pitch = pitch;
        this._yaw = yaw;
        this.updateCameraVectors();
    }

   
    public get view(): Matrix4 {
        return this._viewMat;
    }

    private updateCameraVectors() : void{

        // Calculate the new Front vector
        let front : Vector3 = v3_a;
        front.x = Math.cos(this.radians(this.yaw)) * Math.cos(this.radians(this.pitch));
        front.y = Math.sin(this.radians(this.pitch));
        front.z = Math.sin(this.radians(this.yaw)) * Math.cos(this.radians(this.pitch));
        this._front = front.normalize();

        // Also re-calculate the Right and Up vector
        Vector3.cross(this._right, front, this.worldUp);

        // Normalize the vectors, because their length gets closer to 0 the more you look up or down which results in slower movement.
        this._right.normalize();

        Vector3.cross(this._up, this.right, this._front);

        Matrix4.lookAt(this._viewMat, this.getWorldPosition(), Vector3.add(this.getWorldPosition(), this._front), this._up);
    }


    public update(time: number): void {
        super.update(time);

        if(this._isDirty){
            this.updateCameraVectors();
            this._isDirty = false;
        }
    }

    public radians(degrees: number): number {
        return degrees * (Math.PI / 180.0);
    }

    public processMouseMovement(xoffset : number, yoffset : number, constrainPitch : boolean = true) : void{
        xoffset *= this._mouseSensitivity;
        yoffset *= this._mouseSensitivity;

        this._yaw  += xoffset;
        this._pitch += yoffset;

        // Make sure that when pitch is out of bounds, screen doesn't get flipped
        if (constrainPitch)
        {
            if (this.pitch > 89.0)
                this.pitch = 89.0;

            if (this.pitch < -89.0)
                this.pitch = -89.0;
        }

        this._isDirty = true;
    }

    public processKeyboard(keyCode : number, deltaTime : number) : void{
        let velocity : number = this._movementSpeed * deltaTime / 1000;
        if (keyCode == KEY_CODE_MACRO.w)
            this.transform.position.add(Vector3.multiplyValue(v3_a, this._front, velocity));
        if (keyCode == KEY_CODE_MACRO.s)
            this.transform.position.subtract(Vector3.multiplyValue(v3_a, this._front, velocity));
        if (keyCode == KEY_CODE_MACRO.a)
            this.transform.position.subtract(Vector3.multiplyValue(v3_a, this._right, velocity));
        if (keyCode == KEY_CODE_MACRO.d)
            this.transform.position.add(Vector3.multiplyValue(v3_a, this._right, velocity));

        // this._isDirty = true;
        this.updateCameraVectors();
    }

    public processMouseScroll(yoffset : number) : void{
        let angel: number = Renderer.windowViewport.fov / (Math.PI / 180);
        let sensitivity: number = 0.1;
  
        if (angel >= 1.0 && angel <= 45.0)
          angel -= yoffset * sensitivity;
  
        if (angel <= 1.0)
          angel = 1.0;
  
        if (angel >= 45.0)
          angel = 45.0;
  
        Renderer.windowViewport.fov = angel * (Math.PI / 180);
    }

}