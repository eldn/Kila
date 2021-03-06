import Texture from "./Texture";
import Loader from "../loader/Loader";
import { log } from "../utils/Log";


const placeHolder = new Image();
placeHolder.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * 懒加载纹理
 * ```typescript
 * var material = new Hilo3d.BasicMaterial({
 *     diffuse: new Hilo3d.LazyTexture({
 *         crossOrigin: true,
 *         src: '//img.alicdn.com/tfs/TB1aNxtQpXXXXX1XVXXXXXXXXXX-1024-1024.jpg'
 *     });
 * });
 * ```
 */
export class LazyTexture extends Texture{


    _src: string = '';

    /**
     * 图片是否跨域
     */
    crossOrigin: boolean = false;

    /**
     * 是否在设置src后立即加载图片
     */
    autoLoad: boolean = true;
    /**
     * 资源类型，用于加载时判断
     */
    resType: string = '';

    /**
     * 图片地址
     */
    get src() : string {
        return this._src;
    }

    set src(src : string) {
        if (this._src !== src) {
            this._src = src;
            if (this.autoLoad) {
                this.load();
            }
        }
    }

    public getClassName() : string{
        return "LazyTexture";
    }

    placeHolder : any;
    

    /**
     * @param params 初始化参数，所有params都会复制到实例上
     * @param params.crossOrigin 是否跨域
     * @param params.placeHolder 占位图片，默认为1像素的透明图片
     * @param params.autoLoad 是否自动加载
     * @param params.src 图片地址
     */
    constructor(params : {placeHolder ?: any,autoLoad ?: boolean, src ?: string , crossOrigin ?:boolean}) {
        super();
        if (params) {
            // 必须在src设置前赋值
            if ('crossOrigin' in params) {
                this.crossOrigin = params.crossOrigin;
            }
            if ('autoLoad' in params) {
                this.autoLoad = params.autoLoad;
            }
            if ('placeHolder' in params) {
                this.placeHolder = params.placeHolder;
            }
            if ('src' in params) {
                this.src = params.src;
            }
        }
        this.image = this.placeHolder || placeHolder;
    }

    static loader : Loader;

    /**
     * 加载图片
     * @param hrowError 是否 throw error
     * @return 返回加载的Promise
     */
    public load(throwError : boolean = false) : Promise<any> {
        LazyTexture.loader = LazyTexture.loader || new Loader();
        return LazyTexture.loader.load({
            src: this.src,
            crossOrigin: this.crossOrigin,
            type: this.resType,
            defaultType: 'img'
        }).then((img) => {
            if (img.isTexture) {
                Object.assign(this, img);
                this.needUpdate = true;
                this.needDestroy = true;
                this.fire('load');
            } else {
                this.image = img;
                this.needUpdate = true;
                this.fire('load');
            }
        }, (err) => {
            this.fire('error');
            if (throwError) {
                throw new Error(`LazyTexture Failed ${err}`);
            } else {
                log.warn(`LazyTexture Failed ${err}`);
            }
        });
    }

    _releaseImage() {
        if (this._src && typeof this._src !== 'string') {
            this._src = '';
        }
        super._releaseImage();
    }
}

export default LazyTexture;
