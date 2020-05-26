import LoadCache from "./LoadCache";
import { EventObject } from "../event/EventObject";
import { log } from "../utils/Log";
import { Utils } from "../math/Utils";
import { LoadingItem } from "./LoadingItem";

const cache = new LoadCache();

/**
 * 基础的资源加载类
 * ```typescript
 * var loader : Kila.Loader = new Kila.BasicLoader();
 * loader.load({
 *     src: '//img.alicdn.com/tfs/TB1aNxtQpXXXXX1XVXXXXXXXXXX-1024-1024.jpg',
 *     crossOrigin: true
 * }).then(img => {
 *     return new Kila.Texture({
 *         image: img
 *     });
 * }, err => {
 *     return new Kila.Color(1, 0, 0);
 * }).then(diffuse => {
 *     return new Kila.BasicMaterial({
 *         diffuse: diffuse
 *     });
 * });
 * ```
 */

 class xhrOptions{
    /**
     *资源地址
     */
    url : string;
    /**
     *资源类型(json, buffer, text)
     */
    type : "json" |  "buffer" | "text" = "text"; 

    /**
     *请求类型(GET, POST ..)
     */
    method : "GET" |  "POST" = "GET";

    /**
     *请求头参数
     */
    headers ?: Object;

    /**
     *POST请求发送的数据
     */
    body ?: Document | BodyInit | null;

    credentials ?: string;
 }

class BasicLoader extends EventObject  {

    public static enalbeCache() {
        cache.enabled = true;
    }

    public static disableCache() {
        cache.enabled = false;
    }

    public static deleteCache(key : string) {
        cache.remove(key);
    }

    public static clearCache() {
        cache.clear();
    }

    
    static get cache() {
        return cache;
    }
    
    static set cache(vale) {
        log.warn('BasicLoader.cache is readonly!');
    }

    public getClassName() : string{
        return "BasicLoader";
    }
    
    /**
     * 加载资源，这里会自动调用 loadImg 或者 loadRes
     * @param  data 参数
     * @returns 返回加载完的资源对象
     */
    public load(data : LoadingItem) : Promise<any>{
        const src = data.src;
        let type = data.type;
        if (!type) {
            const ext = Utils.getExtension(src);
            if (/^(?:png|jpe?g|gif|webp|bmp)$/i.test(ext)) {
                type = 'img';
            }
            if (!type) {
                type = data.defaultType;
            }
        }
        if (type === 'img') {
            return this.loadImg(src, data.crossOrigin);
        }
        return this.loadRes(src, type);
    }

    /**
     * 判断链接是否跨域，无法处理二级域名，及修改 document.domain 的情况
     * @param  url 需要判断的链接
     * @returns 是否跨域
     */
    public isCrossOrigin(url : string) : boolean{
        const loc = window.location;
        const a = document.createElement('a');
        a.href = url;
        return a.hostname !== loc.hostname || a.port !== loc.port || a.protocol !== loc.protocol;
    }

    public isBase64(url) : boolean{
        return /^data:(.+?);base64,/.test(url);
    }

    public Uint8ArrayFrom(source, mapFn) : Uint8Array {
        if (Uint8Array.from) {
            return Uint8Array.from(source, mapFn);
        }
        const len = source.length;
        const result = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            result[i] = mapFn(source[i]);
        }
        return result;
    }

    /**
     * 加载图片
     * @param url 图片地址
     * @param crossOrigin 是否跨域
     * @return 返回加载完的图片
     */
    public loadImg(url : string, crossOrigin : boolean = false) : Promise<any> {
        let file = cache.get(url);

        if (file) {
            return cache.wait(file);
        }

        return new Promise((resolve, reject) => {
            let img = new Image();
            cache.update(url, LoadCache.PENDING);
            img.onload = () => {
                img.onerror = null;
                img.onabort = null;
                img.onload = null;
                cache.update(url, LoadCache.LOADED, img);
                resolve(img);
            };
            img.onerror = () => {
                img.onerror = null;
                img.onabort = null;
                img.onload = null;
                const err = new Error(`Image load failed for ${url.slice(0, 100)}`);
                cache.update(url, LoadCache.FAILED, err);
                reject(err);
            };
            img.onabort = img.onerror;
            if (crossOrigin || this.isCrossOrigin(url)) {
                if (!this.isBase64(url)) {
                    img.crossOrigin = 'anonymous';
                }
            }
            img.src = url;
        });
    }

    /**
     * 使用XHR加载其他资源
     * @param  url 资源地址
     * @param type 资源类型(json, buffer, text)
     * @return  返回加载完的内容对象(Object, ArrayBuffer, String)
     */
    public loadRes(url : string, type : "json" | "buffer" | "text" = "text") : Promise<any> {
        if (this.isBase64(url)) {
            const mime = RegExp.$1;
            const base64Str = url.slice(13 + mime.length);
            let result = atob(base64Str);
            if (type === 'json') {
                return Promise.resolve(JSON.parse(result));
            } else if (type === 'buffer') {
                return Promise.resolve(this.Uint8ArrayFrom(result, c => c.charCodeAt(0)).buffer);
            }
        }

        let file = cache.get(url);
        if (file) {
            return cache.wait(file);
        }

        cache.update(url, LoadCache.PENDING);

        this.fire('beforeload');

        let opt : xhrOptions = new xhrOptions();
        opt.url = url;
        opt.type = type;

        return this.request(opt).then((data) => {
            this.fire('loaded');
            cache.update(url, LoadCache.LOADED, data);
            return data;
        }, (err) => {
            this.fire('failed', err);
            cache.update(url, LoadCache.FAILED);
            throw new Error(`Resource load failed for ${url}, ${err}`);
        });
    }

    /**
     * XHR资源请求
     * @param opt 请求参数
     * @returns  返回加载完的内容对象(Object, ArrayBuffer, String)
     */
    public request(opt : xhrOptions) : Promise<any>{
        return new Promise((resolve, reject) => {
            const xhr : XMLHttpRequest = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status < 200 || xhr.status >= 300) {
                    reject(new TypeError(`Network request failed for ${xhr.status}`));
                    return;
                }
                let result = 'response' in xhr ? xhr.response : xhr['responseText'];
                if (opt.type === 'json') {
                    try {
                        result = JSON.parse(result);
                    } catch (err) {
                        reject(new TypeError('JSON.parse error' + err));
                        return;
                    }
                }
                resolve(result);
            };
            xhr.onprogress = (evt) => {
                this.fire('progress', {
                    url: opt.url,
                    loaded: evt.loaded,
                    total: evt.total,
                });
            };
            xhr.onerror = () => {
                reject(new TypeError('Network request failed'));
            };
            xhr.ontimeout = () => {
                reject(new TypeError('Network request timed out'));
            };
            xhr.open(opt.method || 'GET', opt.url, true);
            if (opt.credentials === 'include') {
                xhr.withCredentials = true;
            }
            if (opt.type === 'buffer') {
                xhr.responseType = 'arraybuffer';
            }
            Utils.each(opt.headers, (value, name) => {
                xhr.setRequestHeader(name, value);
            });
            xhr.send(opt.body || null);
        });
    }
}

export default BasicLoader;
