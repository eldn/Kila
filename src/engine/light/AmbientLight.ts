import { Light } from "./Light";


/**
 * 环境光
 * @class
 * @extends Light
 */
class AmbientLight extends Light{
    autoUpdateWorldMatrix: boolean = false;
    /**
     * @constructs
     * @override
     */
    constructor() {
        super();
    }

    getClassName() : string{
        return "AmbientLight";
    }
}

export default AmbientLight;
