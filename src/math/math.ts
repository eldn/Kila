
export class math{

    /**
     * 角度值转弧度值
     */
    public static DEG2RAD: number = Math.PI / 180;

    /**
     * 弧度值转角度值
     */
    public static RAD2DEG: number = 180 / Math.PI;


    private static _uid : number = 0;

    /**
     * 生成唯一ID
     * @param  prefixID前缀
     * @returns ID
     */
    public static generateUUID (prefix : string = '') : string {
        let id = ++this._uid;
        let id_str;
        if (prefix) {
            id_str = prefix + '_' + id;
        } else {
            id_str += '';
        }
        return id_str;
    }

    /**
     * 截取
     * @param   value 值
     * @param  min 最小值
     * @param   max 最大值
     * @returns
     */
    public static clamp(value : number, min : number, max : number) : number {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * 角度值转换成弧度值
     * @param  deg 角度值
     * @returns 弧度值
     */
    public static degToRad(deg : number) : number {
        return deg * this.DEG2RAD;
    }

    /**
     * 弧度值转换成角度值
     * @param   rad 弧度值
     * @returns 角度值
     */
    public static radToDeg(rad : number) : number {
        return rad * this.RAD2DEG;
    }

    /**
     * 是否是 2 的指数值
     * @param   value
     * @returns
     */
    public static isPowerOfTwo(value : number) : boolean {
        return (value & (value - 1)) === 0 && value !== 0;
    }

    /**
     * 最近的 2 的指数值
     * @param value
     * @returns
     */
    public static nearestPowerOfTwo(value : number) : number {
        return 2 ** Math.round(Math.log(value) / Math.LN2);
    }

    /**
     * 下一个的 2 的指数值
     * @param  value
     * @returns
     */
    public static nextPowerOfTwo(value : number) : number {
        value--;
        value |= value >> 1;
        value |= value >> 2;
        value |= value >> 4;
        value |= value >> 8;
        value |= value >> 16;
        value++;

        return value;
    }
}

export default math;
