import { EventObject } from "../event/EventObject"


/**
 * 加载缓存类
 */
class LoadCache extends EventObject{

   
    static PENDING: number = 1;
    static LOADED: number = 2;
    static FAILED: number = 3;
    

    enabled: boolean =  true;

    private _files : Object;

    /**
     * @constructs
     */
    constructor() {
        super();
        this._files = {};
    }

    public getClassName() : string{
        return "LoadCache";
    }

    public update(key : string, state : number, data ?: any) {
        if (!this.enabled) {
            return;
        }
        let file = {
            key,
            state,
            data
        };
        this._files[key] = file;
        this.fire('update', file);
        this.fire(`update:${file.key}`, file);
    }

    public get(key : string) {
        if (!this.enabled) {
            return null;
        }
        return this._files[key];
    }

    public remove(key : string) {
        delete this._files[key];
    }

    public clear() {
        this._files = {};
    }

    public wait(file : any) : Promise<any>{
        if (!file) {
            return Promise.reject();
        }

        if (file.state === LoadCache.LOADED) {
            return Promise.resolve(file.data);
        }

        if (file.state === LoadCache.FAILED) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            this.on(`update:${file.key}`, (evt) => {
                let file = evt.detail;
                if (file.state === LoadCache.LOADED) {
                    resolve(file.data);
                } else if (file.state === LoadCache.FAILED) {
                    reject(file.data);
                }
            }, true);
        });
    }
}

export default LoadCache;
