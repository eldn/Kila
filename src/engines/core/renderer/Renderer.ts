import { RendererViewport, RendererViewportCreateInfo } from "./RendererViewport";

import { gl } from "../gl/GLUtilities";

import { Matrix4x4 } from "../math/Matrix4x4";
import { BasicShader } from "../gl/shaders/BasicShader";
import { Shader } from "../gl/shaders/Shader";
import { LevelManager } from "../world/LevelManager";

export class Renderer {

    private _windowViewport: RendererViewport;

    private _basicShader: BasicShader;

    public constructor( createInfo: RendererViewportCreateInfo ) {
        this._windowViewport = new RendererViewport( createInfo );

    }

    public get windowViewportCanvas(): HTMLCanvasElement {
        return this._windowViewport.canvas;
    }

    public get worldShader(): Shader {
        return this._basicShader;
    }

    public Initialize(): void {

        this._basicShader = new BasicShader();
        this._basicShader.use();
    }

    public Resize(): void {
        if ( this._windowViewport ) {
            this._windowViewport.OnResize( window.innerWidth, window.innerHeight );
        }
    }

    public BeginRender(): void {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public EndRender(): void {

        this._basicShader.use();
        
        // Set uniforms.
        let projectionPosition = this._basicShader.getUniformLocation( "u_projection" );
        let projection = this._windowViewport.GetProjectionMatrix().toFloat32Array();
        gl.uniformMatrix4fv( projectionPosition, false, projection );

        // Use the active camera's matrix as the view
        let view: Matrix4x4;
        if ( LevelManager.isLoaded && LevelManager.activeLevelActiveCamera !== undefined ) {
            view = LevelManager.activeLevelActiveCamera.view;
        } else {
            view = Matrix4x4.identity();
        }
        let viewPosition = this._basicShader.getUniformLocation( "u_view" );
        gl.uniformMatrix4fv( viewPosition, false, view.toFloat32Array() );

    }
}