export const EPSILON = 0.000001;


export class Utils {

    public static each(obj, fn) {
        if (!obj) {
            return;
        }

        if (Array.isArray(obj)) {
            obj.forEach(fn);
        } else {
            Object.keys(obj).forEach((key) => {
                fn(obj[key], key);
            });
        }
    }


    public static getTypedArray(type: string, len: number) {

        switch (type) {
            case 'BYTE':
                return new Int8Array(len);
            case 'UNSIGNED_BYTE':
                return new Uint8Array(len);
            case 'SHORT':
                return new Int16Array(len);
            case 'UNSIGNED_SHORT':
                return new Uint16Array(len);
            case 'UNSIGNED_INT':
                return new Uint32Array(len);
            case 'FLOAT':
                return new Float32Array(len);
            default:
                return new Float32Array(len);
        }
    }

}

