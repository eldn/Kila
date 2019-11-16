import { RendererViewport, RendererViewportCreateInfo } from "./RendererViewport";

import { gl } from "../gl/GLUtilities";

import { Matrix4x4 } from "../math/Matrix4x4";
import { BasicShader } from "../gl/shaders/BasicShader";
import { Shader } from "../gl/shaders/Shader";
import { LevelManager } from "../world/LevelManager";
import { Level } from "../world/Level";
import { FboTestShader } from "../gl/shaders/FBOTestShader";
import { GLBuffer } from "../gl/GLBuffer";
import { globalAgent } from "http";
import { AttributeInfo } from "../gl/AttributeInfo";

export class Renderer {

    public static windowViewport: RendererViewport;

    private _basicShader: BasicShader;

    public constructor(createInfo: RendererViewportCreateInfo) {
        Renderer.windowViewport = new RendererViewport(createInfo);

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



    private frameBufferWidh : number = 1024;
    private freamBufferHeight : number = 1024;
    private framebuffer: WebGLFramebuffer;
    private renderbuffer :WebGLRenderbuffer;
    private textureBuffer : WebGLTexture;

    private fboShader : FboTestShader;
    private testVerticesBuffer : GLBuffer;

    private initFramebufferObject() : void{
        if (!this.framebuffer && !this.renderbuffer) {

             //定义错误函数
            function error() {
                if(this.framebuffer) gl.deleteFramebuffer(this.framebuffer);
                if(this.textureBuffer) gl.deleteFramebuffer(this.textureBuffer);
                if(this.framebuffer) gl.deleteFramebuffer(this.framebuffer);
                return null;
            }

            // 创建帧缓冲
            this.framebuffer = gl.createFramebuffer();
            if(!this.framebuffer){
                console.log("无法创建帧缓冲区对象");
                return error();
            }
            

            // 把纹理对象作为缓冲颜色附件
            // 创建以及设置纹理对象
            this.textureBuffer = gl.createTexture();
            if(!this.textureBuffer){
                console.log("无法创建纹理对象");
                return error();
            }

            gl.bindTexture(gl.TEXTURE_2D, this.textureBuffer);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBufferWidh, this.freamBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            

            // 构造深度和模板缓冲区
            // 创建renderbuffer objects
            this.renderbuffer = gl.createRenderbuffer();
            if(!this.renderbuffer){
                console.log("无法创建渲染缓冲区对象");
                return error();
            }

            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBufferWidh, this.freamBufferHeight);


            // 将纹理和渲染缓冲区对象关联到帧缓冲区对象
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureBuffer, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

            // 错误检查
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
                console.error("ERROR::FRAMEBUFFER:: Framebuffer is not complete!");
            }

             // 解除绑定
            gl.bindTexture(gl.TEXTURE_2D, undefined);
            gl.bindFramebuffer(gl.FRAMEBUFFER, undefined);
            gl.bindRenderbuffer(gl.RENDERBUFFER, undefined);
        }


        if(!this.testVerticesBuffer){

            let quadVertices : number[] = [   // Vertex attributes for a quad that fills the entire screen in Normalized Device Coordinates.
                // Positions   // TexCoords
                -1.0,  1.0,  0.0, 1.0,
                -1.0, -1.0,  0.0, 0.0,
                1.0, -1.0,  1.0, 0.0,
        
                -1.0,  1.0,  0.0, 1.0,
                1.0, -1.0,  1.0, 0.0,
                1.0,  1.0,  1.0, 1.0
            ];	
            this.testVerticesBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);

          
            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 2;
            this.testVerticesBuffer.addAttributeLocation(positionAttribute);

            let textCoordAttribute = new AttributeInfo();
            textCoordAttribute.location = 1;
            textCoordAttribute.size = 2;
            this.testVerticesBuffer.addAttributeLocation(textCoordAttribute);

            this.testVerticesBuffer.setData(quadVertices);
            this.testVerticesBuffer.upload();
            this.testVerticesBuffer.unbind();
        }

        if(!this.fboShader){
            this.fboShader = new FboTestShader();
        }

    }

    public BeginRender(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // ==============> framebuff

        /*
        this.initFramebufferObject();

        // 绑定帧缓冲
        gl.viewport(Renderer.windowViewport.x, Renderer.windowViewport.y, this.frameBufferWidh, this.freamBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        */

        // ==============> framebuff


    }

    public EndRender(): void {

        /*
        // ======> framebuffer test 
        gl.viewport(Renderer.windowViewport.x, Renderer.windowViewport.y, Renderer.windowViewport.width, Renderer.windowViewport.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, undefined);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.DEPTH_TEST)


        // draw framebuffer texture
       this.fboShader.use();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textureBuffer);
        this.fboShader.setUniform1i("screenTexture", 0);
        this.testVerticesBuffer.bind();
        this.testVerticesBuffer.draw();


        // 删除帧缓冲对象
        // gl.deleteFramebuffer(this.framebuffer);
        // gl.deleteRenderbuffer(this.renderbuffer);

         // ======> framebuffer test
         */


        // Set uniforms.
        // let projectionPosition = this._basicShader.getUniformLocation( "u_projection" );
        // let projection = this._windowViewport.GetProjectionMatrix().toFloat32Array();
        // gl.uniformMatrix4fv( projectionPosition, false, projection );

        // Use the active camera's matrix as the view
        // let view: Matrix4x4 = LevelManager.getViewMatrix();
        // let viewPosition = this._basicShader.getUniformLocation( "u_view" );
        // gl.uniformMatrix4fv( viewPosition, false, view.toFloat32Array() );

    }

    public static getProjection(): Matrix4x4 {
        if (Renderer.windowViewport) {
            return Renderer.windowViewport.GetProjectionMatrix();
        } else {
            console.error("windowViewport not initliazed!");
            return null;
        }
    }
}