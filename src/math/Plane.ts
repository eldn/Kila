import { Vector3 } from "./Vector3";

export class Plane{

    public normal : Vector3;
    public distance : number;

    /**
     * @constructs
     * @param  normal  法线
     * @param  distance 距离
     */
    constructor(normal = new Vector3(), distance : number = 0) {
        this.normal = normal;
        this.distance = distance;
    }

    public getClassName() : string{
        return "Plane";
    }


     /**
     * Copy the values from one plane to this
     * @param   m the source plane
     * @return  this
     */
    public copy(plane : Plane) : Plane {
        this.normal.copy(plane.normal);
        this.distance = plane.distance;
        return this;
    }

     /**
     * Creates a new plane initialized with values from this plane
     * @return a new Plane
     */
    public clone() : Plane {
        return new Plane(this.normal.clone(), this.distance);
    }


    /**
     * [set description]
     * @param  x 法线 x
     * @param y 法线 y
     * @param  z 法线 z
     * @param  w 距离
     * @return this
     */
    public set(x : number, y : number, z : number, w : number) : Plane {
        this.normal.set(x, y, z);
        this.distance = w;
        return this;
    }

    /**
     * 归一化
     * @return this
     */
    public normalize() : Plane {
        const inverseNormalLength = 1.0 / this.normal.length();
        this.normal.scale(inverseNormalLength);
        this.distance *= inverseNormalLength;

        return this;
    }

    /**
     * 与点的距离
     * @param   point
     * @return 
     */
    public distanceToPoint(point : Vector3) : number {
        return this.normal.dot(point) + this.distance;
    }

    /**
     * 投影点
     * @param  point
     * @return 
     */
    public projectPoint(point : Vector3) : Vector3 {
        return new Vector3().copy(this.normal).scale(-this.distanceToPoint(point)).add(point);
    }
}