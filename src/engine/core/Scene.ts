import GameObject from "./GameObject";
import { log } from "../utils/Log";
import { Utils } from "../math/Utils";
import { WebGLRenderer } from "../renderer/WebGLRenderer";

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
     * @type {WebGLRenderer}
     */
    renderer: any = null;

      /**
     * 摄像机
     * @type {Camera}
     */
    camera: any = null;


     /**
     * 像素密度
     * @type {number}
     * @default 根据设备自动判断
     */
    pixelRatio: number;

     /**
     * 偏移值
     * @type {number}
     * @default 0
     */
    offsetX: number = 0;

    /**
     * 偏移值
     * @type {Number}
     * @default 0
     */
    offsetY: number = 0;

    width : number = 0;
    height : number = 0;
    rendererWidth : number = 0;
    rendererHeight : number = 0;


    canvas : HTMLCanvasElement;


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

        this.width = params.width;
        this.height = params.height;
        this.camera = params.camera;
        this.canvas = params.canvas;
        this.pixelRatio = params.pixelRatio;

        this.initRenderer(params);
    }

    /**
     * 初始化渲染器
     * @private
     * @param  {Object} params
     */
    initRenderer(params : iSceneParams) {
        const canvas = this.canvas = this.createCanvas(params);
        this.renderer = new WebGLRenderer(canvas, params.clearColor);
        this.resize(this.width, this.height, this.pixelRatio, true);
    }

    /**
     * 生成canvas
     * @private
     * @param  {Object} params
     * @return {Canvas}
     */
    createCanvas(params : iSceneParams) {
        let canvas;
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
     * @param  {Number} width 舞台宽
     * @param  {Number} height 舞台高
     * @param  {Number} [pixelRatio=this.pixelRatio] 像素密度
     * @param  {Boolean} [force=false] 是否强制刷新
     * @return {Stage} 舞台本身。链式调用支持。
     */
    resize(width : number, height : number, pixelRatio ?: number, force ?: boolean) {

        if (pixelRatio === undefined) {
            pixelRatio = this.pixelRatio;
        }

        if (force || this.width !== width || this.height !== height || this.pixelRatio !== pixelRatio) {
            this.width = width;
            this.height = height;
            this.pixelRatio = pixelRatio;
            this.rendererWidth = width * pixelRatio;
            this.rendererHeight = height * pixelRatio;

            const canvas = this.canvas;
            const renderer = this.renderer;

            renderer.resize(this.rendererWidth, this.rendererHeight, force);
            canvas.style.width = this.width + 'px';
            canvas.style.height = this.height + 'px';
        }
        return this;
    }

    /**
     * 设置舞台偏移值
     * @param {Number} x x
     * @param {Number} y y
     * @return {Stage} 舞台本身。链式调用支持。
     */
    setOffset(x : number, y : number) {
        if (this.offsetX !== x || this.offsetY !== y) {
            this.offsetX = x;
            this.offsetY = y;

            const pixelRatio = this.pixelRatio;
            this.renderer.setOffset(x * pixelRatio, y * pixelRatio);
        }
        return this;
    }

     /**
     * 改viewport
     * @param  {Number} x      x
     * @param  {Number} y      y
     * @param  {Number} width  width
     * @param  {Number} height height
     * @return {Stage} 舞台本身。链式调用支持。
     */
    viewport(x : number, y : number, width : number, height : number) {
        this.resize(width, height, this.pixelRatio, true);
        this.setOffset(x, y);
        return this;
    }

    /**
     * 渲染一帧
     * @param  {number} dt 间隔时间
     * @return {Stage} 舞台本身。链式调用支持。
     */
    tick(dt : number) {
        this.traverseUpdate(dt);
        if (this.camera) {
            this.renderer.render(this, this.camera, true);
        }
        return this;
    }

    /**
     * 释放 WebGL 资源
     * @return {Stage} this
     */
    releaseGLResource() {
        this.renderer.releaseGLResource();
        return this;
    }

     /**
     * 销毁
     * @return {Stage} this
     */
    destroy() {
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