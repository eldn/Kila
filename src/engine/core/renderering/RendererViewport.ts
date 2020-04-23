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

    public fov?: number;

    public nearClip: number;

    public farClip: number;

    public projectionType: ViewportProjectionType;

    public elementId?: string;
}


export class RendererViewport {
    private _isDirty: boolean = true;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _fov: number;
    private _nearClip: number;
    private _farClip: number;
    private _projectionType: ViewportProjectionType;
    private _projection: Matrix4;
    private _sizeMode: ViewportSizeMode = ViewportSizeMode.DYNAMIC;

    private _canvas: HTMLCanvasElement;

  
    public constructor( createInfo: RendererViewportCreateInfo ) {

        this._width = createInfo.width;
        this._height = createInfo.height;
        this._x = createInfo.x;
        this._y = createInfo.y;
        this._nearClip = createInfo.nearClip;
        this._farClip = createInfo.farClip;
        this._fov = createInfo.fov;
        this._projectionType = createInfo.projectionType;

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

        // Matrix4.orthographic( 0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0 )
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

    public get fov(): number {
        return this._fov;
    }

    public set fov( value: number ) {
        this._fov = value;
        this._isDirty = true;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get nearClip(): number {
        return this._nearClip;
    }

    public set nearClip( value: number ) {
        this._nearClip = value;
        this._isDirty = true;
    }

    public get farClip(): number {
        return this._farClip;
    }

    public set farClip( value: number ) {
        this._farClip = value;
        this._isDirty = true;
    }

    public get projectionType(): ViewportProjectionType {
        return this._projectionType;
    }

    public set projectionType( value: ViewportProjectionType ) {
        this._projectionType = value;
        this._isDirty = true;
    }

    public getProjectionMatrix(): Matrix4 {
        if ( this._isDirty || this._projection === undefined ) {
            this.regenerateMatrix();
        }
        return this._projection;
    }

  
    public OnResize( width: number, height: number ): void {
        this._width = width;
        this._height = height;
        this._isDirty = true;

        if ( this._canvas !== undefined ) {
            if ( this._sizeMode === ViewportSizeMode.DYNAMIC ) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                this._width = window.innerWidth;
                this._height = window.innerHeight;
                gl.viewport( this._x, this._y, this._width, this._height );
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

                gl.viewport( this._x, this._y, newWidth, newHeight );

                // NOTE: The renderer shouldn't care about setting this in the input manager. May want to do this with messages instead.
                let resolutionScale = new Vector2( newWidth / this._width, newHeight / this._height );
                InputManager.setResolutionScale( resolutionScale );
            }
        }
    }

    public Reposition( x: number, y: number ): void {
        this._x = x;
        this._y = y;
        this._isDirty = true;
    }

    private regenerateMatrix(): void {
        this._projection = new Matrix4();
        if ( this._projectionType === ViewportProjectionType.ORTHOGRAPHIC ) {
            // this._projection = Matrix4.orthographic( this._x, this._width, this._height, this._y, this._nearClip, this._farClip );
            this._projection.ortho( this._x, this._width, this._height, this._y, this._nearClip, this._farClip )
        } else {
            // this._projection = Matrix4.perspective( this._fov, this._width / this._height, this._nearClip, this._farClip );
            const elements = this._projection.elements;
            const near = this._nearClip;
            const far = this._farClip;
            const aspect = this.width / this.height;
            const fov = this._fov;

            const f = 1 / Math.tan(0.5 * math.degToRad(fov));
    
            elements[0] = f / aspect;
            elements[5] = f;
            elements[11] = -1;
            elements[15] = 0;
    
            if (far) {
                const nf = 1 / (near - far);
                elements[10] = (near + far) * nf;
                elements[14] = 2 * far * near * nf;
            } else {
                elements[10] = -1;
                elements[14] = -2 * near;
            }
        }
    }
}