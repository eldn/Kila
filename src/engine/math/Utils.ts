import { glConstants } from "../constants/glConstants";


export const EPSILON = 0.000001;


const {
    BYTE,
    UNSIGNED_BYTE,
    SHORT,
    UNSIGNED_SHORT,
    UNSIGNED_INT,
    FLOAT
} = glConstants;


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


    public static copyArrayData(destArr, srcArr, destIdx, srcIdx, count) {
        if (!destArr || !srcArr) {
            return;
        }
        if (srcArr.isGeometryData) {
            srcArr = srcArr.data;
        }
        for (let i = 0; i < count; i++) {
            destArr[destIdx + i] = srcArr[srcIdx + i];
        }
    }

    public static hasOwnProperty(obj, name) {
        return Object.prototype.hasOwnProperty.call(obj, name);
    }


    public static getElementRect(elem : HTMLCanvasElement) {
        const docElem = document.documentElement;
        let bounds;
        try {
            // this fails if it's a disconnected DOM node
            bounds = elem.getBoundingClientRect();
        } catch (e) {
            bounds = {
                top: elem.offsetTop,
                left: elem.offsetLeft,
                right: elem.offsetLeft + elem.offsetWidth,
                bottom: elem.offsetTop + elem.offsetHeight
            };
        }
    
        const offsetX = ((window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)) || 0;
        const offsetY = ((window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0)) || 0;
        const styles = window.getComputedStyle ? getComputedStyle(elem) : elem['currentStyle'];
        const parseIntFn = parseInt;
    
        const padLeft = (parseIntFn(styles.paddingLeft) + parseIntFn(styles.borderLeftWidth)) || 0;
        const padTop = (parseIntFn(styles.paddingTop) + parseIntFn(styles.borderTopWidth)) || 0;
        const padRight = (parseIntFn(styles.paddingRight) + parseIntFn(styles.borderRightWidth)) || 0;
        const padBottom = (parseIntFn(styles.paddingBottom) + parseIntFn(styles.borderBottomWidth)) || 0;
    
        const top = bounds.top || 0;
        const left = bounds.left || 0;
        const right = bounds.right || 0;
        const bottom = bounds.bottom || 0;
    
        return {
            left: left + offsetX + padLeft,
            top: top + offsetY + padTop,
            width: right - padRight - left - padLeft,
            height: bottom - padBottom - top - padTop
        };
    }

    public static padLeft(str : string, len : number, char ?: string) {
        if (len <= str.length) {
            return str;
        }
    
        return new Array(len - str.length + 1).join(char || '0') + str;
    }

    public static getTypedArrayGLType(array) {
        if (array instanceof Float32Array) {
            return FLOAT;
        }
    
        if (array instanceof Int8Array) {
            return BYTE;
        }
    
        if (array instanceof Uint8Array) {
            return UNSIGNED_BYTE;
        }
    
        if (array instanceof Int16Array) {
            return SHORT;
        }
    
        if (array instanceof Uint16Array) {
            return UNSIGNED_SHORT;
        }
    
        if (array instanceof Uint32Array) {
            return UNSIGNED_INT;
        }
    
        return FLOAT;
    }

    public static getTypedArrayClass(type){
        const TypedArrayClassMap = {
            [glConstants.BYTE]: Int8Array,
            [glConstants.UNSIGNED_BYTE]: Uint8Array,
            [glConstants.SHORT]: Int16Array,
            [glConstants.UNSIGNED_SHORT]: Uint16Array,
            [glConstants.UNSIGNED_INT]: Uint32Array,
            [glConstants.FLOAT]: Float32Array
        };
        return TypedArrayClassMap[type] || Float32Array;
    }



}

