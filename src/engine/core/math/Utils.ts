export const EPSILON = 0.000001;


export class Utils{

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

}

