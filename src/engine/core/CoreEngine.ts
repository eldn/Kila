import { Renderer } from "./renderering/Renderer";
import { IGame } from "../game/IGame";
import { RendererViewportCreateInfo, ViewportProjectionType } from "./renderering/RendererViewport";
import { AssetManager } from "./assets/AssetManager";
import { InputManager } from "./input/InputManager";
import { MessageBus } from "./message/MessageBus";
import { ComponentManager } from "./components/ComponentManager";
import { BehaviorManager } from "./behaviors/BehaviorManager";
import { gl } from "./gl/GLUtilities";
import { Matrix4 } from "./math/Matrix4";
import { semantic } from "./renderering/Semantic";
import { WebGLState } from "./renderering/WebGlState";
import { Camera } from "./world/cameras/Camera";
import { Vector3 } from "./math/Vector3";

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
        rendererViewportCreateInfo.fov = 45.0 * Math.PI / 180;
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

        let activeCamera : Camera = this._game.getRunningScene().activeCamera;
        semantic.init(this._renderer, this._renderer.state, activeCamera, null, null);
        activeCamera.updateViewProjectionMatrix();

        let projection : Matrix4 = Renderer.getProjection();
        let viewMatrix : Matrix4 = activeCamera.viewMatrix;
        
        // Set view uniforms.
        let projectionPosition = this._renderer.worldShader.getUniformLocation( "u_projection" );
        gl.uniformMatrix4fv( projectionPosition, false, projection.toArray());

        // Use the active camera's matrix as the view
        // let testView : Matrix4 = new Matrix4();
        // testView.lookAt(new Vector3(0, 0, 10), new Vector3(0, 0, -1), new Vector3(0, 1, 0));
        let viewPosition = this._renderer.worldShader.getUniformLocation( "u_view" );
        gl.uniformMatrix4fv( viewPosition, false, viewMatrix.toArray());
         

        this._game.getRunningScene().render( this._renderer.worldShader, projection, viewMatrix);
        this._game.render( this._renderer.worldShader );

        this._renderer.EndRender();
    }
}