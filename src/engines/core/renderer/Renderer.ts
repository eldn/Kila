import { RendererViewport, RendererViewportCreateInfo } from "./RendererViewport";

import { gl } from "../gl/GLUtilities";

import { Matrix4x4 } from "../math/Matrix4x4";
import { BasicShader } from "../gl/shaders/BasicShader";
import { Shader } from "../gl/shaders/Shader";
import { LevelManager } from "../world/LevelManager";
import { Level } from "../world/Level";

export class Renderer {

    public static windowViewport: RendererViewport;

    private _basicShader: BasicShader;

    public constructor( createInfo: RendererViewportCreateInfo ) {
        Renderer.windowViewport = new RendererViewport( createInfo );

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
        if ( Renderer.windowViewport ) {
            Renderer.windowViewport.OnResize( window.innerWidth, window.innerHeight );
        }
    }

    public BeginRender(): void {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public EndRender(): void {

        // Set uniforms.
        // let projectionPosition = this._basicShader.getUniformLocation( "u_projection" );
        // let projection = this._windowViewport.GetProjectionMatrix().toFloat32Array();
        // gl.uniformMatrix4fv( projectionPosition, false, projection );

        // Use the active camera's matrix as the view
        // let view: Matrix4x4 = LevelManager.getViewMatrix();
        // let viewPosition = this._basicShader.getUniformLocation( "u_view" );
        // gl.uniformMatrix4fv( viewPosition, false, view.toFloat32Array() );

    }

    public static getProjection() : Matrix4x4{
        if(Renderer.windowViewport){
            return Renderer.windowViewport.GetProjectionMatrix();
        } else {
            console.error("windowViewport not initliazed!");
            return null;
        }
    }
}