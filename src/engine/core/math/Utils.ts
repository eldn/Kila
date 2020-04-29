import { gl } from "../gl/GLUtilities";

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


    public static getTypedArray(type: number, len: number) {

        switch (type) {
            case gl.BYTE:
                return new Int8Array(len);
            case gl.UNSIGNED_BYTE:
                return new Uint8Array(len);
            case gl.SHORT:
                return new Int16Array(len);
            case gl.UNSIGNED_SHORT:
                return new Uint16Array(len);
            case gl.UNSIGNED_INT:
                return new Uint32Array(len);
            case gl.FLOAT:
                return new Float32Array(len);
            default:
                return new Float32Array(len);
        }
    }

    public static getTypedArrayGLType(array) {
        if (array instanceof Float32Array) {
            return gl.FLOAT;
        }
    
        if (array instanceof Int8Array) {
            return gl.BYTE;
        }
    
        if (array instanceof Uint8Array) {
            return gl.UNSIGNED_BYTE;
        }
    
        if (array instanceof Int16Array) {
            return gl.SHORT;
        }
    
        if (array instanceof Uint16Array) {
            return gl.UNSIGNED_SHORT;
        }
    
        if (array instanceof Uint32Array) {
            return gl.UNSIGNED_INT;
        }
    
        return gl.FLOAT;
    }

}

