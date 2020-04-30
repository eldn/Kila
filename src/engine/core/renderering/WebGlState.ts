/**
 * WebGL 状态管理，减少 api 调用
 * @class
 */
export class WebGLState{

    private _gl: WebGLRenderingContext;

    private _dict : Object;

    private activeTextureIndex : number;

    private textureUnitDict : Object;

    private  currentFramebuffer : WebGLFramebuffer;
    public  preFramebuffer : WebGLFramebuffer;
    private systemFramebuffer : WebGLFramebuffer;

    /**
     * @constructs
     * @param  {WebGLRenderingContext} gl
     */
    constructor(gl : WebGLRenderingContext) {
        this._gl = gl;
        this.reset();
    }

    /**
     * 重置状态
     */
    reset() {
        this._dict = {};
        this.activeTextureIndex = null;
        this.textureUnitDict = {};
        this.currentFramebuffer = null;
        this.preFramebuffer = null;
    }

    /**
     * enable
     * @param  {GLenum} capability
     */
    enable(capability : number) {
        const value = this._dict[capability];
        if (value !== true) {
            this._dict[capability] = true;
            this._gl.enable(capability);
        }
    }

    /**
     * disable
     * @param  {GLenum} capability
     */
    disable(capability : number) {
        const value = this._dict[capability];
        if (value !== false) {
            this._dict[capability] = false;
            this._gl.disable(capability);
        }
    }

    /**
     * bindFramebuffer
     * @param  {GLenum} target
     * @param  {WebGLFramebuffer} framebuffer
     */
    bindFramebuffer(target : number, framebuffer : WebGLFramebuffer) {
        if (this.currentFramebuffer !== framebuffer) {
            this.preFramebuffer = this.currentFramebuffer;
            this.currentFramebuffer = framebuffer;
            this._gl.bindFramebuffer(target, framebuffer);
        }
    }

    /**
     * 绑定系统framebuffer
     */
    bindSystemFramebuffer() {
        this.bindFramebuffer(this._gl.FRAMEBUFFER, this.systemFramebuffer);
    }

    /**
     * useProgram
     * @param  { WebGLProgram} program
     */
    useProgram(program : WebGLProgram) {
        this.set1('useProgram', program);
    }

    /**
     * depthFunc
     * @param  {GLenum } func
     */
    depthFunc(func : number) {
        this.set1('depthFunc', func);
    }

    /**
     * depthMask
     * @param  {GLenum } flag
     */
    depthMask(flag : number) {
        this.set1('depthMask', flag);
    }

    /**
     * clear
     * @param  {Number} mask
     */
    clear(mask : number) {
        this._gl.clear(mask);
    }

    /**
     * depthRange
     * @param  {Number} zNear
     * @param  {Number} zFar
     */
    depthRange(zNear : number, zFar : number) {
        this.set2('depthRange', zNear, zFar);
    }

    /**
     * stencilFunc
     * @param  {GLenum} func
     * @param  {Number} ref
     * @param  {Number} mask
     */
    stencilFunc(func : number, ref : number, mask : number) {
        this.set3('stencilFunc', func, ref, mask);
    }

    /**
     * stencilMask
     * @param  {Number} mask
     */
    stencilMask(mask : number) {
        this.set1('stencilMask', mask);
    }

    /**
     * stencilOp
     * @param  {GLenum} fail
     * @param  {GLenum} zfail
     * @param  {GLenum} zpass
     */
    stencilOp(fail : number, zfail : number, zpass : number) {
        this.set3('stencilOp', fail, zfail, zpass);
    }

    /**
     * colorMask
     * @param  {Boolean} red
     * @param  {Boolean} green
     * @param  {Boolean} blue
     * @param  {Boolean} alpha
     */
    colorMask(red : number, green : number, blue : number, alpha : number) {
        this.set4('colorMask', red, green, blue, alpha);
    }

    /**
     * cullFace
     * @param  {GLenum} mode
     */
    cullFace(mode) {
        this.set1('cullFace', mode);
    }

    /**
     * frontFace
     * @param  {GLenum} mode
     */
    frontFace(mode) {
        this.set1('frontFace', mode);
    }

    /**
     * blendFuncSeparate
     * @param  {GLenum} srcRGB
     * @param  {GLenum} dstRGB
     * @param  {GLenum} srcAlpha
     * @param  {GLenum} dstAlpha
     */
    blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha) {
        this.set4('blendFuncSeparate', srcRGB, dstRGB, srcAlpha, dstAlpha);
    }

    /**
     * blendEquationSeparate
     * @param  {GLenum} modeRGB
     * @param  {GLenum} modeAlpha
     */
    blendEquationSeparate(modeRGB, modeAlpha) {
        this.set2('blendEquationSeparate', modeRGB, modeAlpha);
    }

    /**
     * viewport
     * @param  {Number} x
     * @param  {Number} y
     * @param  {Number} width
     * @param  {Number} height
     */
    viewport(x, y, width, height) {
        this.set4('viewport', x, y, width, height);
    }


    /**
     * activeTexture
     * @param  {Number} texture
     */
    activeTexture(texture) {
        if (this.activeTextureIndex !== texture) {
            this.activeTextureIndex = texture;
            this._gl.activeTexture(texture);
        }
    }

    /**
     * bindTexture
     * @param  {GLenum} target
     * @param  {WebGLTexture } texture
     */
    bindTexture(target, texture) {
        let textureUnit = this.getActiveTextureUnit();
        if (textureUnit[target] !== texture) {
            textureUnit[target] = texture;
            this._gl.bindTexture(target, texture);
        }
    }

    /**
     * 获取当前激活的纹理对象
     * @return {TextureUnit}
     */
    getActiveTextureUnit() {
        let textureUnit = this.textureUnitDict[this.activeTextureIndex];
        if (!textureUnit) {
            textureUnit = this.textureUnitDict[this.activeTextureIndex] = {};
        }
        return textureUnit;
    }

    /**
     * 调 gl 1参数方法
     * @private
     * @param  {String} name  方法名
     * @param  {Number|Object} param 方法参数
     */
    set1(name, param) {
        const value = this._dict[name];
        if (value !== param) {
            this._dict[name] = param;
            this._gl[name](param);
        }
    }

    /**
     * 调 gl 2参数方法
     * @private
     * @param  {String} name  方法名
     * @param  {Number|Object} param0 方法参数
     * @param  {Number|Object} param1 方法参数
     */
    set2(name, param0, param1) {
        let value = this._dict[name];
        if (!value) {
            value = this._dict[name] = [];
        }

        if (value[0] !== param0 || value[1] !== param1) {
            value[0] = param0;
            value[1] = param1;
            this._gl[name](param0, param1);
        }
    }

    /**
     * 调 gl 3参数方法
     * @private
     * @param  {String} name  方法名
     * @param  {Number|Object} param0 方法参数
     * @param  {Number|Object} param1 方法参数
     * @param  {Number|Object} param2 方法参数
     */
    set3(name, param0, param1, param2) {
        let value = this._dict[name];
        if (!value) {
            value = this._dict[name] = [];
        }

        if (value[0] !== param0 || value[1] !== param1 || value[2] !== param2) {
            value[0] = param0;
            value[1] = param1;
            value[2] = param2;
            this._gl[name](param0, param1, param2);
        }
    }

    /**
     * 调 gl 4参数方法
     * @private
     * @param  {String} name  方法名
     * @param  {Number|Object} param0 方法参数
     * @param  {Number|Object} param1 方法参数
     * @param  {Number|Object} param2 方法参数
     * @param  {Number|Object} param3 方法参数
     */
    set4(name, param0, param1, param2, param3) {
        let value = this._dict[name];
        if (!value) {
            value = this._dict[name] = [];
        }

        if (value[0] !== param0 || value[1] !== param1 || value[2] !== param2 || value[3] !== param3) {
            value[0] = param0;
            value[1] = param1;
            value[2] = param2;
            value[3] = param3;
            this._gl[name](param0, param1, param2, param3);
        }
    }

    get(name) {
        return this._dict[name];
    }
}
