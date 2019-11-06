import { IBehaviorData } from "./IBehaviorData";
import { Vector3 } from "../math/Vector3";
import { IBehaviorBuilder } from "./IBehaviorBuilder";
import { IBehavior } from "./IBehavior";
import { BaseBehavior } from "./BaseBehavior";
import { Vector2 } from "../math/Vector2";
import { Message } from "../message/Message";
import { MESSAGE_MOUSE_DOWN, MESSAGE_MOUSE_UP, MESSAGE_MOUSE_MOVE, MouseContext } from "../input/InputManager";
import { IMessageHandler } from "../message/IMessageHandler";
import { Quaternion } from "../math/Quaternion";



const v2_1 = new Vector2();
const v2_2 = new Vector2();
const v3_1 = new Vector3();
const qt_1 = new Quaternion(1,1,1,1);

export class FirstPersonCameraBehaviorData implements IBehaviorData {

    public name: string;

    public moveSpeed: number = 1;

    public moveSpeedShiftScale : number = 5;

    public  damp : number = 0.2;

    public setFromJson(json: any): void {
        if (json.name === undefined) {
            throw new Error("Name must be defined in behavior data.");
        }

        this.name = String(json.name);

        if (json.moveSpeed !== undefined) {
            this.moveSpeed = json.moveSpeed;
        }

        if (json.moveSpeedShiftScale !== undefined) {
            this.moveSpeedShiftScale = json.moveSpeedShiftScale;
        }

        if (json.damp !== undefined) {
            this.damp = json.damp;
        }
    }
}

export class FirstPersonCameraBehaviorBuilder implements IBehaviorBuilder {
    public get type(): string {
        return "fisrtPersonCamera";
    }

    public buildFromJson(json: any): IBehavior {
        let data = new FirstPersonCameraBehaviorData();
        data.setFromJson(json);
        return new FirstPersonCameraBehavior(data);
    }
}


export class FirstPersonCameraBehavior extends BaseBehavior implements IMessageHandler{
    

    public moveSpeed: number = 1;

    public moveSpeedShiftScale : number = 5;

    public  damp : number = 0.2;

    private _euler : Vector3 = new Vector3();
    private _velocity : Vector3  = new Vector3();
    private _position : Vector3 = new Vector3();
    private _speedScale : number = 1;

    private _touchStart : Vector2 = new Vector2();

    public constructor(data: FirstPersonCameraBehaviorData) {
        super(data);

        this.moveSpeed = data.moveSpeed;
        this.moveSpeedShiftScale = data.moveSpeedShiftScale;
        this.damp = data.damp;

        Message.subscribe( MESSAGE_MOUSE_DOWN, this);
        Message.subscribe( MESSAGE_MOUSE_MOVE, this);
        Message.subscribe( MESSAGE_MOUSE_UP, this);
    }

    onMessage(message: Message): void {
        switch(message.code){
            case MESSAGE_MOUSE_DOWN:
                this.onTouchStart(message.context);
                break;
            case MESSAGE_MOUSE_MOVE:
                this.onTouchMove(message.context);
                break;
            case MESSAGE_MOUSE_UP:
                this.onTouchEnd(message.context);
                break;
        }
    }

    private onTouchStart(event : MouseContext) {
        this._touchStart = event.position;
    }

    private onTouchMove(event : MouseContext) {
        let v2_2 : Vector2 = event.position;
        v2_2 = v2_2.subtract(this._touchStart);
        this._velocity.x = v2_2.x * 0.01;
        this._velocity.z = -v2_2.y * 0.01;
    }

    private onTouchEnd(event : MouseContext){

    }

    
    public update(dt: number): void {

         // position
        //  Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
        //  Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
        //  Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);
        //  this.node.setPosition(v3_1);

        let v3_1 : Vector3 = new Vector3();
        let quat : Quaternion = new Quaternion(1, 1,1,1);
        Quaternion.fromVector3(quat, this._owner.transform.rotation)
        Vector3.transformQuat(v3_1, this._velocity, quat);
        Vector3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
        Vector3.lerp(v3_1, this._owner.transform.position, this._position, dt / this.damp);
        this._owner.transform.position.copyFrom(v3_1);
    

         // rotation
         Quaternion.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
         let quat1 : Quaternion = new Quaternion(1, 1,1,1);
         Quaternion.fromVector3(quat, this._owner.transform.rotation)
         Quaternion.slerp(qt_1, quat1, qt_1, dt / this.damp);
         this._owner.transform.position = new Vector3(qt_1.x, qt_1.y, qt_1.z);

        super.update(dt);
    }
}