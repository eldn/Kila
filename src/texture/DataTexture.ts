import Texture from "./Texture";
import { glConstants } from "../constants";
import { Utils } from "../math/Utils";
import { math } from "../math";

const {
    TEXTURE_2D,
    RGBA,
    NEAREST,
    CLAMP_TO_EDGE,
    FLOAT
} = glConstants;

export class DataTexture extends Texture{

    public target : number = TEXTURE_2D;
    public internalFormat : number = RGBA;
    public format : number = RGBA;
    public type : number = FLOAT;
    public magFilter  : number = NEAREST;
    public minFilter : number = NEAREST;
    public wrapS : number = CLAMP_TO_EDGE;
    public wrapT : number = CLAMP_TO_EDGE;
    public dataLength : number = 0;
    public DataClass : any;

    
    constructor(data : any) {
        super();
        this.data = data.data;
    }

    public getClassName() : string{
        return "DataTexture";
    }

    public resetSize(dataLen : number) : void {
        if (dataLen === this.dataLength) {
            return;
        }
        this.dataLength = dataLen;
        const pixelCount = math.nextPowerOfTwo(dataLen / 4);
        const n = Math.max(Math.log2(pixelCount), 4);
        const w = Math.floor(n / 2);
        const h = n - w;
        this.width = 2 ** w;
        this.height = 2 ** h;
        this.DataClass = Utils.getTypedArrayClass(this.type);
    }

     /**
     * 数据，改变数据的时候会自动更新Texture
     */
    get data() {
        return this.image;
    }

    set data(_data) {
        if (this.image !== _data) {
            this.resetSize(_data.length);
            const len = this.width * this.height * 4;
            if (len === _data.length && _data instanceof this.DataClass) {
                this.image = _data;
            } else {
                if (!this.image || this.image.length !== len) {
                    this.image = new this.DataClass(len);
                }
                this.image.set(_data, 0);
            }
            this.needUpdate = true;
        }
    }


    

}