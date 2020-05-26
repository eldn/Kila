import { BasicMaterial } from "./BasicMaterial";
import { glConstants } from "../constants/glConstants";
import { vertexType } from "../constants/vertexType";
import { RenderOptions } from "../renderer";

const {
    NONE
} = glConstants;

const {
    POSITION,
    NORMAL,
    DEPTH,
    DISTANCE,
} = vertexType;

export class GeometryMaterial extends BasicMaterial{

   /**
     * 顶点类型 POSITION, NORMAL, DEPTH, DISTANCE
     */
    public vertexType: string = POSITION;
    public lightType: TypedLight = "NONE";

     /**
     * 是否直接存储
     */
    public writeOriginData: boolean = false;

  
    constructor() {
        super();
        Object.assign(this.uniforms, {
            u_cameraFar: 'CAMERAFAR',
            u_cameraNear: 'CAMERANEAR',
            u_cameraType: 'CAMERATYPE'
        });
    }

    public getRenderOption(option : RenderOptions = {}) : RenderOptions {
        super.getRenderOption.call(this, option);
        option[`VERTEX_TYPE_${this.vertexType}`] = 1;

        switch (this.vertexType) {
            case POSITION:
                option.HAS_FRAG_POS = 1;
                break;
            case NORMAL:
                option.HAS_NORMAL = 1;
                break;
            case DEPTH:
                break;
            case DISTANCE:
                option.HAS_FRAG_POS = 1;
                break;
            default:
                break;
        }

        if (this.writeOriginData) {
            option.WRITE_ORIGIN_DATA = 1;
        }

        return option;
    }

    public getClassName() : string{
        return "GeometryMaterial";
    }

}