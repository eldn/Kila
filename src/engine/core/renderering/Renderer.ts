import { RendererViewport, RendererViewportCreateInfo } from "./RendererViewport";

import { gl } from "../gl/GLUtilities";

import { BasicShader } from "../gl/shaders/BasicShader";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4 } from "../math/Matrix4";
import { WebGLState } from "./WebGlState";

export class Renderer {

    public  windowViewport: RendererViewport;

    private _basicShader: BasicShader;


    private _state: WebGLState;

    public get state(): WebGLState {
        return this._state;
    }

    public set state(value: WebGLState) {
        this._state = value;
    }

    public constructor(createInfo: RendererViewportCreateInfo) {
        this.windowViewport = new RendererViewport(createInfo);
        this._state = new WebGLState(gl);

        this.initialize();
    }

    public get windowViewportCanvas(): HTMLCanvasElement {
        return this.windowViewport.canvas;
    }

    public get worldShader(): Shader {
        return this._basicShader;
    }

    public initialize(): void {

        this._basicShader = new BasicShader();
        this._basicShader.use();

        this.resize();
    }

    public resize(): void {
        this.windowViewport.OnResize(window.innerWidth, window.innerHeight);
    }

    public beginRender(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public endRender(): void {

       
    }

    public get canvasWitdh() : number{
        return this.windowViewport.width;
    }

    public get canvasHeight() : number{
        return this.windowViewport.height;
    }
}