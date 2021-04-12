
/**
 * WebGL 状态管理，减少 api 调用
 */
export class WebGLState{

    gl: WebGLRenderingContext;
    private _dict : Object;
    private activeTextureIndex : number;
    private textureUnitDict : Object;
    private  currentFramebuffer : WebGLFramebuffer;
    public  preFramebuffer : WebGLFramebuffer;
    private systemFramebuffer : WebGLFramebuffer;
    private _pixelStorei : Object;

    /**
     * @param gl
     */
    constructor(gl : WebGLRenderingContext) {
        this.gl = gl;
        this.reset(gl);
    }

    public getClassName() : string{
        return "WebGLState";
    }

    /**
     * 重置状态
     */
    public reset(gl) {
        this._dict = {};
        this.activeTextureIndex = null;
        this.textureUnitDict = {};
        this.currentFramebuffer = null;
        this.preFramebuffer = null;
        this._pixelStorei = {};
    }

    /**
     * enable
     * @param  capability
     */
    public enable(capability : number) {
        const value = this._dict[capability];
        if (value !== true) {
            this._dict[capability] = true;
            this.gl.enable(capability);
        }
    }

    /**
     * disable
     * @param capability
     */
    public disable(capability : number) {
        const value = this._dict[capability];
        if (value !== false) {
            this._dict[capability] = false;
            this.gl.disable(capability);
        }
    }

    /**
     * bindFramebuffer
     * @param  target
     * @param  framebuffer
     */
    public bindFramebuffer(target : number, framebuffer : WebGLFramebuffer) {
        if (this.currentFramebuffer !== framebuffer) {
            this.preFramebuffer = this.currentFramebuffer;
            this.currentFramebuffer = framebuffer;
            this.gl.bindFramebuffer(target, framebuffer);
        }
    }

    /**
     * 绑定系统framebuffer
     */
    public bindSystemFramebuffer() {
        this.bindFramebuffer(this.gl.FRAMEBUFFER, this.systemFramebuffer);
    }

    /**
     * useProgram
     * @param  program
     */
    public useProgram(program : WebGLProgram) {
        this.set1('useProgram', program);
    }

    /**
     * depthFunc
     * @param   func
     */
    public depthFunc(func : number) {
        this.set1('depthFunc', func);
    }

    /**
     * depthMask
     * @param   flag
     */
    public depthMask(flag : number | boolean) {
        this.set1('depthMask', flag);
    }

    /**
     * clear
     * @param   mask
     */
    public clear(mask : number) {
        this.gl.clear(mask);
    }

    /**
     * depthRange
     * @param   zNear
     * @param  zFar
     */
    public depthRange(zNear : number, zFar : number) {
        this.set2('depthRange', zNear, zFar);
    }

    /**
     * stencilFunc
     * @param  func
     * @param   ref
     * @param   mask
     */
    public stencilFunc(func : number, ref : number, mask : number) {
        this.set3('stencilFunc', func, ref, mask);
    }

    /**
     * stencilMask
     * @param   mask
     */
    public stencilMask(mask : number) {
        this.set1('stencilMask', mask);
    }

    /**
     * stencilOp
     * @param  fail
     * @param  zfail
     * @param  zpass
     */
    public stencilOp(fail : number, zfail : number, zpass : number) {
        this.set3('stencilOp', fail, zfail, zpass);
    }

    /**
     * colorMask
     * @param  red
     * @param   green
     * @param   blue
     * @param  alpha
     */
    public colorMask(red : number, green : number, blue : number, alpha : number) {
        this.set4('colorMask', red, green, blue, alpha);
    }

    /**
     * cullFace
     * @param  mode
     */
    public cullFace(mode : number) {
        this.set1('cullFace', mode);
    }

    /**
     * frontFace
     * @param  mode
     */
    public frontFace(mode : number) {
        this.set1('frontFace', mode);
    }

    /**
     * blendFuncSeparate
     * @param   srcRGB
     * @param   dstRGB
     * @param   srcAlpha
     * @param  dstAlpha
     */
    public blendFuncSeparate(srcRGB : number, dstRGB : number, srcAlpha : number, dstAlpha : number) {
        this.set4('blendFuncSeparate', srcRGB, dstRGB, srcAlpha, dstAlpha);
    }

    /**
     * blendEquationSeparate
     * @param  {GLenum} modeRGB
     * @param  {GLenum} modeAlpha
     */
    public blendEquationSeparate(modeRGB : number, modeAlpha : number) {
        this.set2('blendEquationSeparate', modeRGB, modeAlpha);
    }

    /**
     * pixelStorei
     * @param   pname
     * @param  param
     */
    public pixelStorei(pname : number, param : number | boolean) {
        const currentParam = this._pixelStorei[pname];
        if (currentParam !== param) {
            this._pixelStorei[pname] = param;
            this.gl.pixelStorei(pname, param);
        }
    }

    /**
     * viewport
     * @param   x
     * @param   y
     * @param  width
     * @param  height
     */
    public viewport(x : number, y : number, width : number, height : number) : void{
        this.set4('viewport', x, y, width, height);
    }


    /**
     * activeTexture
     * @param  texture
     */
    public activeTexture(texture : number) : void {
        if (this.activeTextureIndex !== texture) {
            this.activeTextureIndex = texture;
            this.gl.activeTexture(texture);
        }
    }

    /**
     * bindTexture
     * @param  target
     * @param   texture
     */
    public bindTexture(target : number, texture : WebGLTexture) : void {
        let textureUnit = this.getActiveTextureUnit();
        if (textureUnit[target] !== texture) {
            textureUnit[target] = texture;
            this.gl.bindTexture(target, texture);
        }
    }

    /**
     * 获取当前激活的纹理对象
     * @return
     */
    public getActiveTextureUnit() : number {
        let textureUnit = this.textureUnitDict[this.activeTextureIndex];
        if (!textureUnit) {
            textureUnit = this.textureUnitDict[this.activeTextureIndex] = {};
        }
        return textureUnit;
    }

    /**
     * 调 gl 1参数方法
     * @param   name  方法名
     * @param   param 方法参数
     */
    private set1(name : string, param : number | Object) {
        const value = this._dict[name];
        if (value !== param) {
            this._dict[name] = param;
            this.gl[name](param);
        }
    }

    /**
     * 调 gl 2参数方法
     * @param   name  方法名
     * @param   param0 方法参数
     * @param   param1 方法参数
     */
    private set2(name : string, param0 : number|Object, param1 : number|Object) {
        let value = this._dict[name];
        if (!value) {
            value = this._dict[name] = [];
        }

        if (value[0] !== param0 || value[1] !== param1) {
            value[0] = param0;
            value[1] = param1;
            this.gl[name](param0, param1);
        }
    }

    /**
     * 调 gl 3参数方法
     * @param name  方法名
     * @param  param0 方法参数
     * @param  param1 方法参数
     * @param  param2 方法参数
     */
    private set3(name : string, param0 : number | Object, param1: number | Object, param2: number | Object) {
        let value = this._dict[name];
        if (!value) {
            value = this._dict[name] = [];
        }

        if (value[0] !== param0 || value[1] !== param1 || value[2] !== param2) {
            value[0] = param0;
            value[1] = param1;
            value[2] = param2;
            this.gl[name](param0, param1, param2);
        }
    }

    /**
     * 调 gl 4参数方法
     * @param  name  方法名
     * @param  param0 方法参数
     * @param  param1 方法参数
     * @param  param2 方法参数
     * @param  param3 方法参数
     */
    private set4(name : string, param0: number | Object, param1: number | Object, param2: number | Object, param3: number | Object) {
        let value = this._dict[name];
        if (!value) {
            value = this._dict[name] = [];
        }

        if (value[0] !== param0 || value[1] !== param1 || value[2] !== param2 || value[3] !== param3) {
            value[0] = param0;
            value[1] = param1;
            value[2] = param2;
            value[3] = param3;
            this.gl[name](param0, param1, param2, param3);
        }
    }

    public get(name : string) {
        return this._dict[name];
    }
}
