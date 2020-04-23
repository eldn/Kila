import { Vector3 } from "./Vector3";
import { Matrix4 } from "./Matrix4";


export class Transform {

    public position: Vector3 = new Vector3();

    public rotation: Vector3 = new Vector3();

    public scale: Vector3 = new Vector3(1, 1, 1);

 
    public copyFrom(transform: Transform): void {
        this.position.copy(transform.position);
        this.rotation.copy(transform.rotation);
        this.scale.copy(transform.scale);
    }

    public getTransformationMatrix(): Matrix4 {
        let translation = new Matrix4().translate(this.position);

        let rotation = new Matrix4();
        rotation.rotateX(this.rotation.x);
        rotation.rotateY(this.rotation.y);
        rotation.rotateZ(this.rotation.z);
        let scale = new  Matrix4().scale(this.scale);

        // T * R * S
        return translation.multiply(rotation).multiply(scale);
    }
}