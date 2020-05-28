import { Light } from "./Light";
import { ltcTexture } from "./ltcTexture";
import { DataTexture } from "../texture/DataTexture";

export class AreaLight extends Light{

    public static ltcTexture1 : any = null;
    public static ltcTexture2 : any = null;
    /**  ltcTexture 是否加载完成 */
    public static ltcTextureReady : boolean = false;



    public width : number = 10;
    public height : number  = 10;


    /**
     * @constructs
     */
    constructor() {
        super();
        AreaLight._loadLtcTexture();
    }


    private _enabled: boolean = true;
   
    get enabled() {
        return this._enabled && AreaLight.ltcTextureReady;
    }

    set enabled(value) {
        this._enabled = value;
    }


    /**
     * 初始化 ltcTexture
     */
    private static _loadLtcTexture() {
        if (this.ltcTextureReady) {
            return;
        }

        let data = JSON.parse(ltcTexture);

        this.ltcTexture1 = new DataTexture({
            data: data.ltcTexture1
        });

        this.ltcTexture2 = new DataTexture({
            data: data.ltcTexture2
        });
        this.ltcTextureReady = true;
        
    }

     /**
     * ltcTexture1
     */
    get ltcTexture1() : DataTexture {
        return AreaLight.ltcTexture1;
    }

    set ltcTexture1(texture : DataTexture) {
        AreaLight.ltcTexture1 = texture;
    }

    /**
     * ltcTexture1
     */
    get ltcTexture2() : DataTexture {
        return AreaLight.ltcTexture2;
    }

    set ltcTexture2(texture : DataTexture) {
        AreaLight.ltcTexture2 = texture;
    }

}