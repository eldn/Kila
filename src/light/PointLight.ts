import { Light } from "./Light";

export class PointLight extends Light{


    public getClassName() : string{
        return "PointLight";
    }

    /**
     *  创建对象的属性参数。可包含此类的所有属性。
     */
    constructor() {
        super();
    }

}