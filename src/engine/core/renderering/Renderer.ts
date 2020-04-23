import { RendererViewport, RendererViewportCreateInfo } from "./RendererViewport";

import { gl } from "../gl/GLUtilities";

import { BasicShader } from "../gl/shaders/BasicShader";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4 } from "../math/Matrix4";
import { WebGLState } from "./WebGlState";

export class Renderer {

    public static windowViewport: RendererViewport;

    private _basicShader: BasicShader;


    private _state: WebGLState;

    public get state(): WebGLState {
        return this._state;
    }

    public set state(value: WebGLState) {
        this._state = value;
    }

    public constructor(createInfo: RendererViewportCreateInfo) {
        Renderer.windowViewport = new RendererViewport(createInfo);
        this._state = new WebGLState(gl);
    }

    public get windowViewportCanvas(): HTMLCanvasElement {
        return Renderer.windowViewport.canvas;
    }

    public get worldShader(): Shader {
        return this._basicShader;
    }

    public Initialize(): void {

        this._basicShader = new BasicShader();
        this._basicShader.use();
    }

    public Resize(): void {
        if (Renderer.windowViewport) {
            Renderer.windowViewport.OnResize(window.innerWidth, window.innerHeight);
        }
    }

    public BeginRender(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public EndRender(): void {

       
    }

    public static getProjection(): Matrix4 {
        if (Renderer.windowViewport) {
            return Renderer.windowViewport.getProjectionMatrix();
        } else {
            console.error("windowViewport not initliazed!");
            return null;
        }
    }
}