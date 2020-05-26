import { Vector4 } from "./Vector4";
import { Utils } from "./Utils";


/**
 * 颜色类
 */
export class Color extends Vector4{

    public getClassName() : string{
        return "Color";
    }

    
    get r() : number  {
        return this.x;
    }

    set r(v : number ) {
        this.x = v;
    }
    
   
    get g() : number  {
        return this.y;
    }

    set g(v : number ) {
        this.y = v;
    }
  
    get b() : number  {
        return this.z;
    }

    set b(v : number ) {
        this.z = v;
    }
    
  
    get a() : number  {
        return this.w;
    }

    set a(v : number ) {
        this.w = v;
    }
    

    constructor(r : number = 1, g : number  = 1, b : number  = 1, a : number  = 1) {
        super( r, g, b, a);
    }
    /**
     * 转换到数组
     * @param  array 转换到的数组
     * @param  offset 数组偏移值
     * @returns
     */
    public toRGBArray(array : Array<number>  = [], offset  : number = 0) : Array<number>{
        const el = this.elements;
        array[offset] = el[0];
        array[offset + 1] = el[1];
        array[offset + 2] = el[2];
        return array;
    }

    /**
     * 从数组赋值
     * @param   array 数组
     * @param  offset 数组偏移值
     * @returns
     */
    public fromUintArray(array : Array<number> , offset : number  = 0) : Color {
        this.elements[0] = array[offset] / 255;
        this.elements[1] = array[offset + 1] / 255;
        this.elements[2] = array[offset + 2] / 255;
        this.elements[3] = array[offset + 3] / 255;
        return this;
    }

    /**
     * 从十六进制值赋值
     * @param   hex 颜色的十六进制值，可以以下形式："#ff9966", "ff9966", "#f96", "f96", 0xff9966
     * @returns
     */
    public fromHEX(hex : number | string ): Color {
        if (typeof hex === 'number') {
            hex = Utils.padLeft(hex.toString(16), 6);
        } else {
            if (hex[0] === '#') {
                hex = hex.slice(1);
            }
            if (hex.length === 3) {
                hex = hex.replace(/(\w)/g, '$1$1');
            }
        }
        this.elements[0] = parseInt(hex.slice(0, 2), 16) / 255;
        this.elements[1] = parseInt(hex.slice(2, 4), 16) / 255;
        this.elements[2] = parseInt(hex.slice(4, 6), 16) / 255;
        return this;
    }

    /**
     * 转16进制
     * @returns
     */
    public toHEX() : string {
        let hex = '';
        for (let i = 0; i < 3; i++) {
            hex += Utils.padLeft(Math.floor(this.elements[i] * 255).toString(16), 2);
        }
        return hex;
    }
}

export default Color;
