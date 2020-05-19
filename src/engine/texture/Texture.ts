import { glConstants } from "../constants/glConstants";
import { Pool } from "../utils/Pool";
import { log } from "../utils/Log";
import math from "../math/math";
import capabilities from "../renderer/capabilities";
import extensions from "../renderer/extensions";
import { WebGLState } from "../renderer/WebGlState";



const {
    TEXTURE_2D,
    RGBA,
    LINEAR,
    NEAREST,
    REPEAT,
    CLAMP_TO_EDGE,
    UNSIGNED_BYTE
} = glConstants;

const cache = new Pool();

export class Texture {
    
    /**
     * 缓存
     * @readOnly
     * @type {Object}
     */
    static get cache() {
        return cache;
    }
    
    /**
     * 重置
     * @param  {WebGLRenderingContext} gl
     */
    static reset(gl) {
        cache.each((glTexture, id) => {
            gl.deleteTexture(glTexture);
            cache.remove(id);
        });
    }

    /**
     * 图片资源是否可以释放，可以的话，上传到GPU后将释放图片引用
     * @type {boolean}
     * @default false
     */
    isImageCanRelease: boolean = false;
    _isImageReleased: boolean = false;
    _image: any = null;
    id : string;

    /**
     * 图片对象
     * @type {Image}
     * @default null
     */
    get image() {
        if (this._isImageReleased) {
            log.errorOnce(`Read Texture.image(${this.id})`, 'Read Texture.image after image released!');
        }
        return this._image;
    }
    
    set image(_img) {
        this._image = _img;
        this._isImageReleased = false;
    }
    
    private _canvasImage : any;
    private _canvasCtx : any;
    private _originImage : any;

    _releaseImage() {
        this._canvasImage = null;
        this._canvasCtx = null;
        this._originImage = null;
        this._image = null;
        this.mipmaps = null;
        this._isImageReleased = true;
    }

    /**
     * mipmaps
     * @type {Image[]|TypedArray[]}
     * @default null
     */
    mipmaps: Array<any> = null;

    /**
     * Texture Target
     * @default gl.TEXTURE_2D
     * @type {GLenum}
     */
    target : number = TEXTURE_2D;

    /**
     * Texture Internal Format
     * @default gl.RGBA
     * @type {GLenum}
     */
    internalFormat: number = RGBA;

    /**
     * 图片 Format
     * @default gl.RGBA
     * @type {GLenum}
     */
    format: number = RGBA;

    /**
     * 类型
     * @default gl.UNSIGNED_BYTE
     * @type {GLenum}
     */
    type: number =  UNSIGNED_BYTE;

    /**
     * @default 0
     * @type {number}
     */
    width: number = 0;

    /**
     * @default 0
     * @type {number}
     */
    height: number = 0;

    /**
     * @default 0
     * @readOnly
     * @type {Number}
     */
    border: number = 0;

    /**
     * magFilter
     * @default gl.LINEAR
     * @type {GLenum}
     */
    magFilter: number = LINEAR;

    /**
     * minFilter
     * @default gl.LINEAR
     * @type {GLenum}
     */
    minFilter: number = LINEAR;

    /**
     * wrapS
     * @default gl.REPEAT
     * @type {GLenum}
     */
    wrapS: number = REPEAT;

    /**
     * wrapT
     * @default gl.REPEAT
     * @type {GLenum}
     */
    wrapT: number = REPEAT;

    /**
     * @type {string}
     */
    name: string = '';

    /**
     * @default false
     * @type {boolean}
     */
    premultiplyAlpha: boolean = false;

    /**
     * 是否翻转Texture的Y轴
     * @default false
     * @type {boolean}
     */
    flipY: boolean = false;

    /**
     * 是否压缩
     * @default false
     * @type {Boolean}
     */
    compressed: boolean = false;

    /**
     * 是否需要更新Texture
     * @default true
     * @type {boolean}
     */
    needUpdate: boolean = true;
    /**
     * 是否需要销毁之前的Texture，Texture参数变更之后需要销毁
     * @default false
     * @type {boolean}
     */
    needDestroy: boolean = false;

    /**
     * 是否每次都更新Texture
     * @default false
     * @type {boolean}
     */
    autoUpdate: boolean = false;
    /**
     * uv
     * @default 0
     * @type {number}
     */
    uv: number = 0;

    /**
     * anisotropic
     * @default 1
     * @type {Number}
     */
    anisotropic: number = 1;

    /**
     * 获取原始图像宽度。
     * @default 0
     * @type {Number}
     */
    get origWidth() {
        if (this._originImage) {
            return this._originImage.width || this.width;
        }

        if (this.image) {
            return this.image.width || this.width;
        }

        return this.width;
    }
    

    /**
     * 获取原始图像高度。
     * @default 0
     * @type {Number}
     */
    get origHeight() {
        if (this._originImage) {
            return this._originImage.height || this.height;
        }

        if (this.image) {
            return this.image.height || this.height;
        }

        return this.height;
    }
    

    /**
     * 是否使用 mipmap
     * @readOnly
     * @type {Boolean}
     */
    get useMipmap() {
        return this.minFilter !== LINEAR && this.minFilter !== NEAREST;
    }

    set useMipmap(value) {
        log.warn('texture.useMipmap is readOnly!');
    }
    

    /**
     * 是否使用 repeat
     * @readOnly
     * @type {Boolean}
     */
    get useRepeat() {
        return this.wrapS !== CLAMP_TO_EDGE || this.wrapT !== CLAMP_TO_EDGE;
    }

    set useRepeat(value) {
        log.warn('texture.useRepeat is readOnly!');
    }
    

    /**
     * mipmapCount
     * @readOnly
     * @type {Number}
     */
    get mipmapCount() {
        return Math.floor(Math.log2(Math.max(this.width, this.height)) + 1);
    }
    
    set mipmapCount(value) {
        log.warn('texture.mipmapCount is readOnly!');
    }
    

    /**
     * @constructs
     * @param {object} params 初始化参数，所有params都会复制到实例上
     */
    constructor(params) {
        this.id = math.generateUUID(this.constructor.name);
        Object.assign(this, params);
    }


    /**
     * 是否是 2 的 n 次方
     * @param  {Image}  img
     * @return {Boolean}
     */
    isImgPowerOfTwo(img) {
        return math.isPowerOfTwo(img.width) && math.isPowerOfTwo(img.height);
    }
    
    /**
     * 获取支持的尺寸
     * @param  {Image} img
     * @param  {Boolean} [needPowerOfTwo=false]
     * @return {Object} { width, height }
     */
    getSupportSize(img, needPowerOfTwo = false) {
        let width = img.width;
        let height = img.height;

        if (needPowerOfTwo && !this.isImgPowerOfTwo(img)) {
            width = math.nextPowerOfTwo(width);
            height = math.nextPowerOfTwo(height);
        }

        const maxTextureSize = capabilities['MAX_TEXTURE_SIZE'];
        if (maxTextureSize) {
            if (width > maxTextureSize) {
                width = maxTextureSize;
            }

            if (height > maxTextureSize) {
                height = maxTextureSize;
            }
        }

        return {
            width,
            height
        };
    }

    /**
     * 更新图片大小成为 2 的 n 次方
     * @param  {Image} img
     * @return {Canvas|Image}
     */
    resizeImgToPowerOfTwo(img) {
        const sizeResult = this.getSupportSize(img, true);
        return this.resizeImg(img, sizeResult.width, sizeResult.height);
    }

    /**
     * 更新图片大小
     * @param  {Image} img
     * @param {Number} width
     * @param {Number} height
     * @return {Canvas|Image}
     */
    resizeImg(img, width, height) {
        if (img.width === width && img.height === height) {
            return img;
        }

        let canvas = this._canvasImage;
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            this._canvasImage = canvas;
            this._canvasCtx = canvas.getContext('2d');
        } else {
            canvas.width = width;
            canvas.height = height;
            this._canvasCtx = canvas.getContext('2d');
        }
        this._canvasCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
        log.warnOnce(`Texture.resizeImg(${this.id})`, `image size(${img.width}x${img.height}) is not support. Resized to ${canvas.width}x${canvas.height}`, img.src);
        this._originImage = img;
        return canvas;
    }

    /**
     * GL上传贴图
     * @private
     * @param  {WebGLState} state
     * @param  {GLEnum} target
     * @param  {Image|TypedArray} image
     * @param  {image} [level=0]
     * @param  {Number} [width=this.width]
     * @param  {Number} [height=this.height]
     * @return {Texture}  this
     */
    _glUploadTexture(state, target, image, level = 0, width = this.width, height = this.height) {
        const gl = state.gl;
        if (this.compressed) {
            gl.compressedTexImage2D(target, level, this.internalFormat, width, height, this.border, image);
        } else if (image && image.width !== undefined) {
            gl.texImage2D(target, level, this.internalFormat, this.format, this.type, image);
        } else {
            gl.texImage2D(target, level, this.internalFormat, width, height, this.border, this.format, this.type, image);
        }

        return this;
    }

    /**
     * 上传贴图，子类可重写
     * @private
     * @param  {WebGLState} state
     * @return {Texture} this
     */
    _uploadTexture(state) {
        if (this.useMipmap && this.mipmaps) {
            this.mipmaps.forEach((mipmap, index) => {
                this._glUploadTexture(state, this.target, mipmap.data, index, mipmap.width, mipmap.height);
            });
        } else {
            this._glUploadTexture(state, this.target, this.image, 0);
        }

        return this;
    }

    /**
     * 更新 Texture
     * @param  {WebGLState} state
     * @param  {WebGLTexture} glTexture
     * @return {Texture} this
     */
    updateTexture(state, glTexture) {
        const gl = state.gl;
        if (this.needUpdate || this.autoUpdate) {
            if (this._originImage && this.image === this._canvasImage) {
                this.image = this._originImage;
            }
            const useMipmap = this.useMipmap;
            const useRepeat = this.useRepeat;

            if (this.image && !this.image.length) {
                const needPowerOfTwo = useRepeat || useMipmap;
                const sizeResult = this.getSupportSize(this.image, needPowerOfTwo);
                this.image = this.resizeImg(this.image, sizeResult.width, sizeResult.height);
                this.width = this.image.width;
                this.height = this.image.height;
            }

            state.activeTexture(gl.TEXTURE0 + capabilities.MAX_TEXTURE_INDEX);
            state.bindTexture(this.target, glTexture);
            state.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
            state.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!this.flipY);

            const textureFilterAnisotropic = extensions.textureFilterAnisotropic;
            if (textureFilterAnisotropic && this.anisotropic > 1) {
                gl.texParameterf(this.target, textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(this.anisotropic, capabilities.MAX_TEXTURE_MAX_ANISOTROPY));
            }

            this._uploadTexture(state);
            if (useMipmap) {
                if (!this.compressed) {
                    gl.generateMipmap(this.target);
                } else if (!this.mipmaps) {
                    log.warn(`Compressed texture has no mipmips, changed the minFilter from ${this.minFilter} to Linear!`, this);
                    this.minFilter = LINEAR;
                }
            }

            gl.texParameterf(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
            gl.texParameterf(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
            gl.texParameterf(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
            gl.texParameterf(this.target, gl.TEXTURE_WRAP_T, this.wrapT);

            this.needUpdate = false;
        }

        if (this._needUpdateSubTexture) {
            this._uploadSubTextures(state, glTexture);
            this._needUpdateSubTexture = false;
        }

        return this;
    }

    /**
     * 跟新所有的局部贴图
     * @private
     * @param  {WebGLState} state
     * @param  {WebGLTexture} glTexture
     */
    _uploadSubTextures(state, glTexture) {
        if (this._subTextureList && this._subTextureList.length > 0) {
            const gl = state.gl;
            state.activeTexture(gl.TEXTURE0 + capabilities.MAX_TEXTURE_INDEX);
            state.bindTexture(this.target, glTexture);
            state.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
            state.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!this.flipY);

            this._subTextureList.forEach((subInfo) => {
                const xOffset = subInfo[0];
                const yOffset = subInfo[1];
                const image = subInfo[2];

                gl.texSubImage2D(this.target, 0, xOffset, yOffset, this.format, this.type, image);
            });
            this._subTextureList.length = 0;
        }
    }

    _needUpdateSubTexture: boolean = false;
    _subTextureList: Array<any> = null;

    /**
     * 跟新局部贴图
     * @param  {Number} xOffset
     * @param  {Number} yOffset
     * @param  {Image|Canvas|ImageData} image
     */
    updateSubTexture(xOffset, yOffset, image) {
        if (!this._subTextureList) {
            this._subTextureList = [];
        }
        this._subTextureList.push([xOffset, yOffset, image]);
        this._needUpdateSubTexture = true;
    }


    state : WebGLState;

    gl : WebGLRenderingContext;

    /**
     * 获取 GLTexture
     * @param  {WebGLState} state
     * @return {WebGLTexture}
     */
    getGLTexture(state) {
        this.state = state;
        const gl = this.gl = state.gl;
        const id = this.id;

        if (this.needDestroy) {
            this.destroy();
            this.needDestroy = false;
        }

        let glTexture = cache.get(id);
        if (glTexture) {
            this.updateTexture(state, glTexture);
        } else {
            glTexture = gl.createTexture();
            cache.add(id, glTexture);
            this.needUpdate = true;
            this.updateTexture(state, glTexture);
        }

        if (this.isImageCanRelease) {
            this._releaseImage();
        }

        return glTexture;
    }

    /**
     * 设置 GLTexture
     * @param {WebGLTexture}  texture
     * @param {Boolean} [needDestroy=false] 是否销毁之前的 GLTexture
     * @return {Texture} this
     */
    setGLTexture(texture, needDestroy = false) {
        if (needDestroy) {
            this.destroy();
        }
        cache.add(this.id, texture);

        return this;
    }
    /**
     * 销毁当前Texture
     * @return {Texture} this
     */
    destroy() {
        const id = this.id;
        const glTexture = cache.get(id);
        if (glTexture && this.gl) {
            this.gl.deleteTexture(glTexture);
            cache.remove(id);
        }
        return this;
    }
    /**
     * clone
     * @return {Texture}
     */
    clone() {
        const option = Object.assign({}, this);
        delete option.id;
        const texture = new Texture(option);
        return texture;
    }
}

export default Texture;
