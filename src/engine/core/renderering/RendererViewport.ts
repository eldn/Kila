import { GLUtilities, gl } from "../gl/GLUtilities";
import { Vector2 } from "../math/Vector2";
import { InputManager } from "../input/InputManager";
import { Matrix4 } from "../math/Matrix4";
import math from "../math/math";

export enum ViewportProjectionType {

    ORTHOGRAPHIC,

    PERSPECTIVE
}


export enum ViewportSizeMode {
    FIXED,

    DYNAMIC
}

export class RendererViewportCreateInfo {

    public x?: number;

    public y?: number;

    public width?: number;

    public height?: number;


    public elementId?: string;
}


export class RendererViewport {
    private _offsetX: number;
    private _offsetY: number;
    private _width: number;
    private _height: number;
    private _sizeMode: ViewportSizeMode = ViewportSizeMode.DYNAMIC;

    private _canvas: HTMLCanvasElement;

  
    public constructor( createInfo: RendererViewportCreateInfo ) {

        this._width = createInfo.width;
        this._height = createInfo.height;
        this._offsetX = createInfo.x;
        this._offsetY = createInfo.y;

        if ( this._width !== undefined && this._height !== undefined ) {
            //this._aspect = this._width / this._height;
            this._sizeMode = ViewportSizeMode.FIXED;
        }

        this._canvas = GLUtilities.initialize( createInfo.elementId );

        // GL init
        gl.clearColor( 0, 0, 0, 1 );

        // 顺时针表示正面、 剔除后面
        // gl.frontFace(gl.CCW);
        // gl.cullFace(gl.BACK);
        // gl.enable(gl.CULL_FACE);

        // 深度测试
        gl.enable(gl.DEPTH_TEST);
        // gl.depthFunc(gl.LESS);
        gl.depthFunc(gl.LEQUAL);

        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

        // gl.enable(gl.FRAMEBUFFER_SRGB);
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get offsetX(): number {
        return this._offsetX;
    }

    public set offsetX(v : number ){
        this._offsetX = v;
    }

    public get offsetY(): number {
        return this._offsetY;
    }

    public set offsetY(v : number){
        this._offsetY = v;
    }

  
    public OnResize( width: number, height: number ): void {
        this._width = width;
        this._height = height;

        if ( this._canvas !== undefined ) {
            if ( this._sizeMode === ViewportSizeMode.DYNAMIC ) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                this._width = window.innerWidth;
                this._height = window.innerHeight;
                gl.viewport( this._offsetX, this._offsetY, this._width, this._height );
            } else {

                let newWidth = window.innerWidth;
                let newHeight = window.innerHeight;
                let newWidthToHeight = newWidth / newHeight;
                let gameArea = document.getElementById( "gameArea" );
                let aspect = this._width / this._height;

                if ( newWidthToHeight > aspect ) {
                    newWidth = newHeight * aspect;
                    gameArea.style.height = newHeight + 'px';
                    gameArea.style.width = newWidth + 'px';
                } else {
                    newHeight = newWidth / aspect;
                    gameArea.style.width = newWidth + 'px';
                    gameArea.style.height = newHeight + 'px';
                }

                gameArea.style.marginTop = ( -newHeight / 2 ) + 'px';
                gameArea.style.marginLeft = ( -newWidth / 2 ) + 'px';

                this._canvas.width = newWidth;
                this._canvas.height = newHeight;

                gl.viewport( this._offsetX, this._offsetY, newWidth, newHeight );

                // NOTE: The renderer shouldn't care about setting this in the input manager. May want to do this with messages instead.
                let resolutionScale = new Vector2( newWidth / this._width, newHeight / this._height );
                InputManager.setResolutionScale( resolutionScale );
            }
        }
    }

    public Reposition( x: number, y: number ): void {
        this._offsetX = x;
        this._offsetY = y;
    }
}