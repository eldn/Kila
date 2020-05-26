import GameObject from "./GameObject";
import { WebGLRenderer } from "../renderer/WebGLRenderer";
import { Camera } from "../camera";

export interface iSceneParams{
    container ?: HTMLElement;
    width ?: number;
    height ?: number;
    pixelRatio ?: number;
    camera ?: any;
    clearColor ?: any;
    canvas ?: HTMLCanvasElement;
}

export class Scene extends GameObject{


    /**
     * 渲染器
     */
    public renderer: WebGLRenderer = null;

      /**
     * 摄像机
     */
    private _camera: Camera = null;


     /**
     * 像素密度 (default 根据设备自动判断)
     */
    private _pixelRatio: number;

     /**
     * 偏移值
     */
    private _offsetX: number = 0;

    /**
     * 偏移值
     */
    private _offsetY: number = 0;

    private _width : number = 0;
    private _height : number = 0;
    private _rendererWidth : number = 0;
    private _rendererHeight : number = 0;
    private _canvas : HTMLCanvasElement;


    constructor(params : iSceneParams) {
        super();
        if (!params.width) {
            params.width = window.innerWidth;
        }

        if (!params.height) {
            params.height = window.innerHeight;
        }

        if (!params.pixelRatio) {
            let pixelRatio = window.devicePixelRatio || 1;
            pixelRatio = Math.min(pixelRatio, 1024 / Math.max(params.width, params.height), 2);
            pixelRatio = Math.max(pixelRatio, 1);
            params.pixelRatio = pixelRatio;
        }

        this._width = params.width;
        this._height = params.height;
        this._camera = params.camera;
        this._canvas = params.canvas;
        this._pixelRatio = params.pixelRatio;

        this._initRenderer(params);
    }

    public getClassName() : string{
        return "Scene";
    }

    /**
     * 初始化渲染器
     * @private
     * @param  params
     */
    private _initRenderer(params : iSceneParams) : void {
        const canvas = this._canvas = this.createCanvas(params);
        this.renderer = new WebGLRenderer(canvas, params.clearColor);
        this.resize(this._width, this._height, this._pixelRatio, true);
    }

    /**
     * 生成canvas
     * @param   params
     * @returns
     */
    public createCanvas(params : iSceneParams) : HTMLCanvasElement {
        let canvas : HTMLCanvasElement;
        if (params.canvas) {
            canvas = params.canvas;
        } else {
            canvas = document.createElement('canvas');
        }

        if (params.container) {
            params.container.appendChild(canvas);
        }

        return canvas;
    }

    /**
     * 缩放舞台
     * @param   width 舞台宽
     * @param   height 舞台高
     * @param  pixelRatio 像素密度
     * @param  force是否强制刷新
     * @returns 舞台本身。链式调用支持。
     */
    public resize(width : number, height : number, pixelRatio ?: number, force : boolean = false) : Scene{

        if (pixelRatio === undefined) {
            pixelRatio = this._pixelRatio;
        }

        if (force || this._width !== width || this._height !== height || this._pixelRatio !== pixelRatio) {
            this._width = width;
            this._height = height;
            this._pixelRatio = pixelRatio;
            this._rendererWidth = width * pixelRatio;
            this._rendererHeight = height * pixelRatio;

            const canvas = this._canvas;
            const renderer = this.renderer;

            renderer.resize(this._rendererWidth, this._rendererHeight, force);
            canvas.style.width = this._width + 'px';
            canvas.style.height = this._height + 'px';
        }
        return this;
    }

    /**
     * 设置舞台偏移值
     * @param x x
     * @param  y y
     * @returns 舞台本身。链式调用支持。
     */
    public setOffset(x : number, y : number) : Scene {
        if (this._offsetX !== x || this._offsetY !== y) {
            this._offsetX = x;
            this._offsetY = y;

            const pixelRatio = this._pixelRatio;
            this.renderer.setOffset(x * pixelRatio, y * pixelRatio);
        }
        return this;
    }

     /**
     * 改viewport
     * @param   x      x
     * @param   y      y
     * @param   width  width
     * @param  height height
     * @returns  舞台本身。链式调用支持。
     */
    public viewport(x : number, y : number, width : number, height : number) : Scene {
        this.resize(width, height, this._pixelRatio, true);
        this.setOffset(x, y);
        return this;
    }

    /**
     * 渲染一帧
     * @param   dt 间隔时间
     * @returns 舞台本身。链式调用支持。
     */
    public tick(dt : number) : Scene{
        this.traverseUpdate(dt);
        if (this._camera) {
            this.renderer.render(this, this._camera, true);
        }
        return this;
    }

    /**
     * 释放 WebGL 资源
     * @returns this
     */
    public releaseGLResource() : Scene {
        this.renderer.releaseGLResource();
        return this;
    }

     /**
     * 销毁
     * @returns this
     */
    public destroy() : Scene{
        this.releaseGLResource();
        this.traverse((child) => {
            child.off();
            child.parent = null;
        });
        this.children.length = 0;
        this.renderer.off();

        return this;
    }

}