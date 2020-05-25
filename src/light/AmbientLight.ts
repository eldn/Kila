import { Light } from "./Light";


/**
 * 环境光
 */
export class AmbientLight extends Light{

    public autoUpdateWorldMatrix: boolean = false;

    constructor() {
        super();
    }

    public getClassName() : string{
        return "AmbientLight";
    }
}

export default AmbientLight;
