import { RendererViewport, RendererViewportCreateInfo } from "./RendererViewport";

import { gl } from "../gl/GLUtilities";

import { BasicShader } from "../gl/shaders/BasicShader";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4 } from "../math/Matrix4";
import { WebGLState } from "./WebGlState";
import { Scene } from "../world/Scene";
import { Camera } from "../world/cameras/Camera";
import { semantic } from "./Semantic";
import { Color } from "../graphics/Color";
import { Material } from "../material/Material";
import { EventMixin } from "../event/EventMixin";

export class Renderer extends EventMixin{

    public  windowViewport: RendererViewport;

    private _basicShader: BasicShader;


    public forceMaterial: Material;

    private _state: WebGLState;

    public get state(): WebGLState {
        return this._state;
    }

    public set state(value: WebGLState) {
        this._state = value;
    }

    public constructor(createInfo: RendererViewportCreateInfo) {
        super();
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

    public clear(color : Color) : void {
        // gl.clear(color.r, color.g, color.b, color.a);
    }

    public beginRender(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }



    public endRender(): void {

       
    }

    public get width() : number{
        return this.windowViewport.width;
    }

    public get height() : number{
        return this.windowViewport.height;
    }

     /**
     * 设置viewport
     * @param  {Number} [x=this.offsetX]  x
     * @param  {Number} [y=this.offsetY] y
     * @param  {Number} [width=this.gl.drawingBufferWidth]  width
     * @param  {Number} [height=this.gl.drawingBufferHeight]  height
     */
    viewport(x ?: number, y ?: number, width ?: number, height ?: number) {
     

        const state = this._state;

        if (state) {
            if (x === undefined) {
                x = this.windowViewport.offsetX;
            } else {
                this.windowViewport.offsetX = x;
            }

            if (y === undefined) {
                y = this.windowViewport.offsetY;
            } else {
                this.windowViewport.offsetY = y;
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
}