import { EventObject } from "../event/EventObject"


/**
 * 加载缓存类
 * @class
 * @mixes EventMixin
 * @fires update 更新事件
 * @ignore
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

    getClassName() : string{
        return "LoadCache";
    }

    update(key : string, state : number, data ?: any) {
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

    get(key : string) {
        if (!this.enabled) {
            return null;
        }
        return this._files[key];
    }

    remove(key : string) {
        delete this._files[key];
    }

    clear() {
        this._files = {};
    }

    wait(file : any) {
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
