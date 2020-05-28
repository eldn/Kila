import { Vector3 } from "./Vector3";
import { GeometryData } from "../geometry";
import { Matrix4 } from "./Matrix4";

const tempVector3 = new Vector3();

export class Sphere{

    /**
     * 半径
     */
    public radius: number = 0;

    public center : Vector3;


    constructor(center ?: Vector3) {

        if(center){
            this.center = center;
        }

        if (!this.center) {
            this.center = new Vector3(0, 0, 0);
        }
    }

    public getClassName() : string{
        return "Sphere";
    }


    /**
     * 克隆
     */
    public clone() : Sphere {
        const sphere = new Sphere();
        sphere.copy(this);
        return sphere;
    }

    /**
     * 复制
     * @param   sphere
     * @return this
     */
    public copy(sphere) : Sphere {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;
        return this;
    }

    /**
     * 从点生成
     * @param   points
     * @return  this
     */
    public fromPoints(points : Array<number>) : Sphere {
        let center = this.center;
        let maxSquaredRadius = 0;
        for (let i = 0; i < points.length; i += 3) {
            let x = points[i] - center.x;
            let y = points[i + 1] - center.y;
            let z = points[i + 2] - center.z;
            maxSquaredRadius = Math.max(x * x + y * y + z * z, maxSquaredRadius);
        }

        this.radius = Math.sqrt(maxSquaredRadius);
        return this;
    }

     /**
     * 从点生成
     * @param  geometryData
     * @return this
     */
    public fromGeometryData(geometryData : GeometryData) : Sphere {
        let center = this.center;
        let maxSquaredRadius = 0;
        geometryData.traverse((vertexData) => {
            let x = vertexData.x - center.x;
            let y = vertexData.y - center.y;
            let z = vertexData.z - center.z;
            maxSquaredRadius = Math.max(x * x + y * y + z * z, maxSquaredRadius);
        });

        this.radius = Math.sqrt(maxSquaredRadius);
        return this;
    }

    /**
     * transformMat4
     * @param   mat4
     * @return  this
     */
    public transformMat4(mat4 : Matrix4) : Sphere{
        this.center.transformMat4(mat4);
        const scale = mat4.getScaling(tempVector3);
        this.radius *= Math.max(scale.x, scale.y, scale.z);
        return this;
    }
}