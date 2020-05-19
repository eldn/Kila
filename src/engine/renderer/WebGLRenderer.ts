import { EventObject } from "../event/EventObject";
import Color from "../math/Color";
import RenderInfo from "./RenderInfo";
import RenderList from "./RenderList";
import { LightManager } from "../light/LightManager";
import WebGLResourceManager from "./WebGLResourceManager";
import { WebGLState } from "./WebGlState";
import extensions from "./extensions";
import capabilities from "./capabilities";
import glType from "./glType";
import Shader from "../shader/shader";

export class WebGLRenderer extends EventObject{

    /**
     * gl
     * @default null
     * @type {WebGLRenderingContext}
     */
    gl: WebGLRenderingContext = null;


     /**
     * 宽
     * @type {number}
     * @default 0
     */
    width : number =  0;

    /**
     * 高
     * @type {number}
     * @default 0
     */
    height: number = 0;


     /**
     * 偏移值
     * @type {Number}
     * @default 0
     */
    offsetX: number = 0;

    /**
     * 偏移值
     * @type {Number}
     * @default 0
     */
    offsetY: number = 0;

    /**
     * 像素密度
     * @type {number}
     * @default 1
     */
    pixelRatio: number = 1;


    /**
     * dom元素
     * @type {Canvas}
     * @default null
     */
    domElement: HTMLCanvasElement = null;

    /**
     * 是否开启透明背景
     * @type {boolean}
     * @default false
     */
    alpha: boolean = false;

    /**
     * @type {boolean}
     * @default true
     */
    depth: boolean = true;

    /**
     * @type {boolean}
     * @default false
     */
    stencil: boolean = false;

     /**
     * 顶点着色器精度, 可以是以下值：highp, mediump, lowp
     * @type {string}
     * @default highp
     */
    vertexPrecision: string = 'highp';

    /**
     * 片段着色器精度, 可以是以下值：highp, mediump, lowp
     * @type {string}
     * @default mediump
     */
    fragmentPrecision: string = 'highp';

     /**
     * 是否初始化失败
     * @default false
     * @type {Boolean}
     */
    isInitFailed: boolean = false;

    /**
     * 是否初始化
     * @type {Boolean}
     * @default false
     * @private
     */
    _isInit: boolean = false;

    /**
     * 是否lost context
     * @type {Boolean}
     * @default false
     * @private
     */
    _isContextLost: boolean = false;

    /**
     * 背景色
     * @type {Color}
     * @default new Color(1, 1, 1, 1)
     */
    clearColor : Color;

    /**
     * 渲染信息
     * @type {RenderInfo}
     * @default new RenderInfo
     */
    renderInfo : RenderInfo;

    /**
     * 渲染列表
     * @type {RenderList}
     * @default new RenderList
     */
    renderList : RenderList;

    /**
     * 资源管理器
     * @type {WebGLResourceManager}
     * @default new WebGLResourceManager
     */
    lightManager : LightManager;


    resourceManager : WebGLResourceManager;

    state : WebGLState;

    constructor(domElement: HTMLCanvasElement) {
        super();
        
        this.clearColor = new Color(1, 1, 1);
        this.domElement = domElement;
        this.renderInfo = new RenderInfo();
        this.renderList = new RenderList();
        this.lightManager = new LightManager();
        this.resourceManager = new WebGLResourceManager();
    }


     /**
     * 改变大小
     * @param  {number} width  宽
     * @param  {number} height  高
     * @param  {boolean} [force=false] 是否强制刷新
     */
    resize(width : number, height : number, force : boolean) {
        if (force || this.width !== width || this.height !== height) {
            const canvas = this.domElement;
            this.width = width;
            this.height = height;
            canvas.width = width;
            canvas.height = height;
            this.viewport();
        }
    }

    /**
     * 设置viewport偏移值
     * @param {Number} x x
     * @param {Number} y y
     */
    setOffset(x : number, y : number) {
        if (this.offsetX !== x || this.offsetY !== y) {
            this.offsetX = x;
            this.offsetY = y;
            this.viewport();
        }
    }

     /**
     * 设置viewport
     * @param  {Number} [x=this.offsetX]  x
     * @param  {Number} [y=this.offsetY] y
     * @param  {Number} [width=this.gl.drawingBufferWidth]  width
     * @param  {Number} [height=this.gl.drawingBufferHeight]  height
     */
    viewport(x ?: number, y ?: number, width ?: number, height ?: number) {
        const {
            state,
            gl
        } = this;

        if (state) {
            if (x === undefined) {
                x = this.offsetX;
            } else {
                this.offsetX = x;
            }

            if (y === undefined) {
                y = this.offsetY;
            } else {
                this.offsetY = y;
            }

            if (width === undefined) {
                width = gl.drawingBufferWidth;
            }

            if (height === undefined) {
                height = gl.drawingBufferHeight;
            }

            state.viewport(x, y, width, height);
        }
    }

     /**
     * 是否初始化
     * @type {Boolean}
     * @default false
     * @readOnly
     */
    get isInit() : boolean{
        return this._isInit && !this.isInitFailed;
    }
    
    /**
     * 初始化回调
     * @return {WebGLRenderer} this
     */
    onInit(callback : Function) {
        if (this._isInit) {
            callback(this);
        } else {
            this.on('init', () => {
                callback(this);
            }, true);
        }
    }


     /**
     * 初始化 context
     */
    initContext() {
        if (!this._isInit) {
            this._isInit = true;
            try {
                this._initContext();
                this.fire('init');
            } catch (e) {
                this.isInitFailed = true;
                this.fire('initFailed', e);
            }
        }
    }

    private _initContext() {
        const contextAttributes = {
            alpha: this.alpha,
            depth: this.depth,
            stencil: this.stencil
        };
      

        let gl = this.gl = this.domElement.getContext('webgl', contextAttributes) as WebGLRenderingContext;
        gl.viewport(0, 0, this.width, this.height);

        glType.init(gl);
        extensions.init(gl);
        capabilities.init(gl);
        Shader.init(this);

        this.state = new WebGLState(gl);


        this.domElement.addEventListener('webglcontextlost', (e) => {
            this._onContextLost(e);
        }, false);

        this.domElement.addEventListener('webglcontextrestored', (e) => {
            this._onContextRestore(e);
        }, false);
    }

    _onContextLost(e) {
        this.fire('webglContextLost');
        const gl = this.gl;
        this._isContextLost = true;

        e.preventDefault();

        Program.reset(gl);
        Shader.reset(gl);
        Texture.reset(gl);
        Buffer.reset(gl);
        VertexArrayObject.reset(gl);
        this.state.reset(gl);

        this._lastMaterial = null;
        this._lastProgram = null;
    }

    _onContextRestore(e) { // eslint-disable-line no-unused-vars
        this.fire('webglContextRestored');
        const gl = this.gl;
        this._isContextLost = false;
        extensions.reset(gl);
        Framebuffer.reset(gl);
    }




}