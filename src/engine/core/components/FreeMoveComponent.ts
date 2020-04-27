import { BaseComponent } from "./BaseComponent";
import { Vector2 } from "../math/Vector2";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/Message";
import { MouseContext, TouchContext, MESSAGE_MOUSE_WHEEL, MESSAGE_TOUCH_START, MESSAGE_TOUCH_MOVE, InputManager } from "../input/InputManager";
import { PerspectiveCamera } from "../world/cameras/PerspectiveCamera";
import { Renderer } from "../renderering/Renderer";
import { KEY_CODE_MACRO } from "../define/Macro";
import { Vector3 } from "../math/Vector3";

export class FreeMoveComponent extends BaseComponent implements IMessageHandler {

    private firstMouse: boolean = true;
    private lastX: number;
    private lastY: number;
    private _touchStart: Vector2 = Vector2.zero;
    private _mouseSensitivity : number = 0.01;
    private _movementSpeed : number = 2.5;

    update(time: number): void {
        this.processInput(time);
    }


    
    onMessage(message: Message): void {

        if (message.code == MESSAGE_MOUSE_WHEEL) {
            let event: MouseContext = message.context;
            this.processMouseScroll(event.wheelDelta);
        } else if (message.code == MESSAGE_TOUCH_START) {
            let event: TouchContext = message.context;
            this._touchStart.set(event.position.x, event.position.y);
        } else if (message.code == MESSAGE_TOUCH_MOVE) {
            let event: TouchContext = message.context;
            this.processMouseMovement(-(event.position.x - this._touchStart.x) / 2, -(event.position.y - this._touchStart.y) / 2, true);
        }
    }


    private processInput(dt: number): void {
       
        this.lastX = Renderer.windowViewport.width / 2;
        this.lastY = Renderer.windowViewport.height / 2;
        Message.subscribe(MESSAGE_MOUSE_WHEEL, this);
        Message.subscribe(MESSAGE_TOUCH_START, this);
        Message.subscribe(MESSAGE_TOUCH_MOVE, this);


        let canvas: HTMLCanvasElement = Renderer.windowViewport.canvas;
        let delta: number = 10000;
        canvas.addEventListener("up", () => {
            this.processKeyboard(KEY_CODE_MACRO.w, delta);
        }, false);
        canvas.addEventListener("down", () => {
            this.processKeyboard(KEY_CODE_MACRO.s, delta);
        }, false);
        canvas.addEventListener("left", () => {
            this.processKeyboard(KEY_CODE_MACRO.a, delta);
        }, false);
        canvas.addEventListener("right", () => {
            this.processKeyboard(KEY_CODE_MACRO.d, delta);
        }, false);
           
        
        //# region end 初始化摄像机


        // #region start 俯仰角度计算
        let mousePos: Vector2 = InputManager.getMousePosition();
        let xpos: number = mousePos.x;
        let ypos: number = mousePos.y;
        if (this.firstMouse) {
            this.lastX = xpos;
            this.lastY = ypos;
            this.firstMouse = false;
        }

        let xoffset: number = xpos - this.lastX;
        let yoffset: number = this.lastY - ypos;

        this.lastX = xpos;
        this.lastY = ypos;

        this.processMouseMovement(xoffset, yoffset, true);
        // #region end 俯仰角度计算

        try {

            if (InputManager.isKeyDown(KEY_CODE_MACRO.w)) {
                this.processKeyboard(KEY_CODE_MACRO.w, dt);
            }

            if (InputManager.isKeyDown(KEY_CODE_MACRO.s)) {
                this.processKeyboard(KEY_CODE_MACRO.s, dt);
            }

            if (InputManager.isKeyDown(KEY_CODE_MACRO.a)) {
                this.processKeyboard(KEY_CODE_MACRO.a, dt);
            }

            if (InputManager.isKeyDown(KEY_CODE_MACRO.d)) {
                this.processKeyboard(KEY_CODE_MACRO.d, dt);
            }

        }
        catch (e) {
            console.error(e);
        }
    }

    public processMouseMovement(xoffset: number, yoffset: number, constrainPitch: boolean = true): void {
        xoffset *= this._mouseSensitivity;
        yoffset *= this._mouseSensitivity;

        // this.transform.rotationX += xoffset;
        // this.transform.rotationY += yoffset;
        console.log("xoffset:" + xoffset, ",yoffset:" + yoffset);

    }

    public processKeyboard(keyCode: number, deltaTime: number): void {
        let velocity: number = this._movementSpeed * deltaTime / 1000;
        if (keyCode == KEY_CODE_MACRO.w)
            this.move(this._owner.transform.quaternion.getBack(), velocity);
        if (keyCode == KEY_CODE_MACRO.s)
            this.move(this._owner.transform.quaternion.getForward(), velocity);
        if (keyCode == KEY_CODE_MACRO.a)
            this.move(this._owner.transform.quaternion.getLeft(), velocity);
        if (keyCode == KEY_CODE_MACRO.d)
            this.move(this._owner.transform.quaternion.getRight(), velocity);
    }

    private move(dir: Vector3, amt: number) {
        this._owner.transform.position.add(dir.scale(amt));
    }



    public processMouseScroll(yoffset: number): void {
        let angel: number = this._fov / (Math.PI / 180);
        let sensitivity: number = 0.1;

        if (angel >= 1.0 && angel <= 45.0)
            angel -= yoffset * sensitivity;

        if (angel <= 1.0)
            angel = 1.0;

        if (angel >= 45.0)
            angel = 45.0;

        // this._fov = angel * (Math.PI / 180);
    }

}