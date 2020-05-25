import { Matrix4 } from "../math/Matrix4";
import { Vector3 } from "../math/Vector3";
import { Light } from "./Light";
import { Camera } from "../camera";




const tempMatrix4 = new Matrix4();
const tempVector3 = new Vector3();

export class DirectionLight extends Light{

    /**
     * 光方向
     */
    public direction : Vector3 = new Vector3(0, 0, 1);


    constructor() {
        super();
    }

    public getClassName() : string{
        return "DirectionLight";
    }

    public getWorldDirection() : Vector3 {
        tempVector3.copy(this.direction).transformDirection(this.worldMatrix).normalize();
        return tempVector3;
    }
    
    public getViewDirection(camera : Camera) : Vector3 {
        const modelViewMatrix = camera.getModelViewMatrix(this, tempMatrix4);
        tempVector3.copy(this.direction).transformDirection(modelViewMatrix).normalize();
        return tempVector3;
    }

}