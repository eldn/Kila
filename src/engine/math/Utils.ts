

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

}

