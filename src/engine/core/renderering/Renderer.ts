import { RendererViewport, RendererViewportCreateInfo } from "./RendererViewport";

import { gl } from "../gl/GLUtilities";

import { BasicShader } from "../gl/shaders/BasicShader";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4 } from "../math/Matrix4";
import { WebGLState } from "./WebGlState";
import { Scene } from "../world/Scene";
import { Camera } from "../world/cameras/Camera";
import { semantic } from "./Semantic";

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


    public render(scene : Scene, camera : Camera) : void {

        this.beginRender();


        semantic.init(this, this.state, camera, null, null);
        camera.updateViewProjectionMatrix();
        

        let projection : Matrix4 = camera.projectionMatrix;
        let viewMatrix : Matrix4 = camera.viewMatrix;
        
        // Set view uniforms.
        let projectionPosition = this.worldShader.getUniformLocation( "u_projection" );
        gl.uniformMatrix4fv( projectionPosition, false, projection.toArray());

   
        let viewPosition = this.worldShader.getUniformLocation( "u_view" );
        gl.uniformMatrix4fv( viewPosition, false, viewMatrix.toArray());
        scene.sceneGraph.render(this.worldShader, projection, viewMatrix);
        

        this.endRender();
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