import { Renderer } from "./renderering/Renderer";
import { IGame } from "../game/IGame";
import { RendererViewportCreateInfo, ViewportProjectionType } from "./renderering/RendererViewport";
import { AssetManager } from "./assets/AssetManager";
import { InputManager } from "./input/InputManager";
import { MessageBus } from "./message/MessageBus";
import { ComponentManager } from "./components/ComponentManager";
import { BehaviorManager } from "./behaviors/BehaviorManager";
import { MaterialManager } from "./material/MaterialManager";
import { Matrix4x4 } from "./math/Matrix4x4";
import { gl } from "./gl/GLUtilities";

export class CoreEngine {

    private _previousTime: number = 0;
    private _gameWidth: number;
    private _gameHeight: number;

    private _isFirstUpdate: boolean = true;

    private _renderer: Renderer;
    private _game: IGame;

    /**
     * Creates a new engine.
     * @param width The width of the game in pixels.
     * @param height The height of the game in pixels.
     * */
    public constructor( width?: number, height?: number ) {
        this._gameWidth = width;
        this._gameHeight = height;
    }

    /**
     * Starts up this engine.
     * @param game The object containing game-specific logic.
     * @param elementName The name (id) of the HTML element to use as the viewport. Must be the id of a canvas element.
     * */
    public start( game: IGame, elementName?: string ): void {

        this._game = game;

        let rendererViewportCreateInfo: RendererViewportCreateInfo = new RendererViewportCreateInfo();
        rendererViewportCreateInfo.elementId = elementName;
        rendererViewportCreateInfo.projectionType = ViewportProjectionType.PERSPECTIVE;
        rendererViewportCreateInfo.width = this._gameWidth;
        rendererViewportCreateInfo.height = this._gameHeight;
        rendererViewportCreateInfo.nearClip = 0.1;
        rendererViewportCreateInfo.farClip = 1000.0;
        rendererViewportCreateInfo.fov = 45.0 * (Math.PI / 180);
        rendererViewportCreateInfo.x = 0;
        rendererViewportCreateInfo.y = 0;

        this._renderer = new Renderer( rendererViewportCreateInfo );

        // Initialize various sub-systems.
        AssetManager.initialize();
        InputManager.initialize( this._renderer.windowViewportCanvas );
        ComponentManager.initialize();
        BehaviorManager.initialize();

        // Initialize the renderer.
        this._renderer.Initialize();

        // Trigger a resize to make sure the viewport is corrent.
        this.resize();

        // Begin the preloading phase, which waits for various thing to be loaded before starting the game.
        this.preloading();
    }

    /**
     * Resizes the canvas to fit the window.
     * */
    public resize(): void {
        if ( this._renderer ) {
            this._renderer.Resize();
        }
    }

    /**
     * The main game loop.
     */
    private loop(): void {
        if ( this._isFirstUpdate ) {

        }

        this.update();
        this.render();

        requestAnimationFrame( this.loop.bind( this ) );
    }

    private preloading(): void {

        // Make sure to always update the message bus.
        MessageBus.update( 0 );

        // Perform items such as loading the first/initial level, etc.
        this._game.updateReady();

        // Kick off the render loop.
        this.loop();
    }

    private update(): void {
        let delta = performance.now() - this._previousTime;

        MessageBus.update( delta );
        this._game.getRunningScene().update( delta );
        this._game.update( delta );

        this._previousTime = performance.now();
    }

    private render(): void {
        this._renderer.BeginRender();

        let projection : Matrix4x4 = Renderer.getProjection();
        let viewMatrix : Matrix4x4 = this._game.getRunningScene().getViewMatrix();
        
        // Set view uniforms.
        let projectionPosition = this._renderer.worldShader.getUniformLocation( "u_projection" );
        // gl.uniformMatrix4fv( projectionPosition, false, projection.toFloat32Array() );

        let projectionA = [
                1.8107,
                0,
                0,
                0,
                0,
                2.4142,
                0,
                0,
                0,
                0,
                -1.0020,
                -1,
                0,
                0,
                -0.2002,
                0,
        ];
        gl.uniformMatrix4fv( projectionPosition, false, projectionA );

        
        let modelViewA = [
            -0.6557,
            -0.0895,
            0.7497,
            0,
            0.1352,
            -0.9908,
            0,
            0,
            0.7428,
            0.1014,
            0.6618,
            0,
            0,
            0,
            -6,
            1,
        ];
        let modelView = this._renderer.worldShader.getUniformLocation( "u_modelViewMatrix" );
        gl.uniformMatrix4fv( modelView, false, modelViewA);
    
        
        // Set model uniforms.
        // let model = this._renderer.worldShader.getUniformLocation( "u_model" );
        // gl.uniformMatrix4fv( model, false, Matrix4x4.identity().toFloat32Array());

         // Use the active camera's matrix as the view
        //  let viewPosition = this._renderer.worldShader.getUniformLocation( "u_view" );
        //  gl.uniformMatrix4fv( viewPosition, false, viewMatrix.toFloat32Array() );

        this._game.getRunningScene().render( this._renderer.worldShader, projection, viewMatrix);
        this._game.render( this._renderer.worldShader );

        this._renderer.EndRender();
    }
}