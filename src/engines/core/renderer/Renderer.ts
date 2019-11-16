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

        /*
        // ==============> framebuff
        // 创建帧缓冲
        let fbo : WebGLFramebuffer = gl.createFramebuffer();
        // 绑定帧缓冲
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        // 错误检查
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE){
            console.error("ERROR::FRAMEBUFFER:: Framebuffer is not complete!");
        }

        // 把纹理对象作为缓冲颜色附件
        // 创建以及设置纹理对象
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE0, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 800, 600, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE0, 0);
        // 把纹理对象作为颜色附件绑定到帧缓冲区
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        // 构造深度和模板缓冲区
        // 创建renderbuffer objects
        let rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
        // 创建一个深度和模板渲染缓冲对象
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, 800, 600);
        // 把renderbuffer作为颜色附件绑定到帧缓冲区
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);
        // 解除绑定
        gl.bindFramebuffer(gl.FRAMEBUFFER, 0);


        // 删除帧缓冲对象
        gl.deleteFramebuffer(fbo);

        // ==============> framebuff
        */

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