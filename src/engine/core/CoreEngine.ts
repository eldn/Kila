import { Renderer } from "./renderering/Renderer";
import { RendererViewportCreateInfo, ViewportProjectionType } from "./renderering/RendererViewport";
import { AssetManager } from "./assets/AssetManager";
import { InputManager } from "./input/InputManager";
import { MessageBus } from "./message/MessageBus";
import { ComponentManager } from "./components/ComponentManager";
import { BehaviorManager } from "./behaviors/BehaviorManager";
import { gl } from "./gl/GLUtilities";
import { Matrix4 } from "./math/Matrix4";
import { semantic } from "./renderering/Semantic";
import { Camera } from "./world/cameras/Camera";
import { Vector3 } from "./math/Vector3";
import { Scene } from "./world/Scene";
import { PerspectiveCamera } from "./world/cameras/PerspectiveCamera";
import { Mesh } from "./graphics/Mesh";
import { Material } from "./material/Material";
import { MeshRendererComponent } from "./components/MeshRendererComponent";
import { GameObject } from "./world/GameObject";

export class CoreEngine {

    private _previousTime: number = 0;
    private _gameWidth: number;
    private _gameHeight: number;
    private _renderer: Renderer;
  

    /**
     * Creates a new engine.
     * @param width The width of the game in pixels.
     * @param height The height of the game in pixels.
     * */
    public constructor( width?: number, height?: number ) {
        this._gameWidth = width;
        this._gameHeight = height;
    }

    private _scene : Scene;

    /**
     * Starts up this engine.
     * @param game The object containing game-specific logic.
     * @param elementName The name (id) of the HTML element to use as the viewport. Must be the id of a canvas element.
     * */
    public start(elementName?: string ): void {


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

    
        
        let camera : PerspectiveCamera = new PerspectiveCamera("DEFAULT_CAMERA");
        camera.lookAt(new Vector3(0, 0, -1));

        this._scene = new Scene(camera);
        this._scene.load();


        let mesh: Mesh = new Mesh("assets/models/plane3.obj");
        let material: Material = new Material();
        let meshRender: MeshRendererComponent = new MeshRendererComponent(mesh, material);

        let planeObject: GameObject = new GameObject("plane");
        planeObject.transform.z = -10;
        planeObject.transform.rotationX = 45;
        planeObject.transform.rotationY = 45;
        planeObject.addComponent(meshRender);
        this._scene.addObject(planeObject);


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

        this.update();
        this.render();

        requestAnimationFrame( this.loop.bind( this ) );
    }

    private preloading(): void {

        // Make sure to always update the message bus.
        MessageBus.update( 0 );

        // Kick off the render loop.
        this.loop();
    }

    private update(): void {
        let delta = performance.now() - this._previousTime;

        MessageBus.update( delta );
        this._scene.update( delta );

        this._previousTime = performance.now();
    }

    private render(): void {
        this._renderer.BeginRender();

        let scene : Scene = this._scene;
        let camera : Camera = scene.activeCamera;

        semantic.init(this._renderer, this._renderer.state, camera, null, null);
        camera.updateViewProjectionMatrix();

      
        let projection : Matrix4 = Renderer.getProjection();
        let viewMatrix : Matrix4 = camera.viewMatrix;
        
        // Set view uniforms.
        let projectionPosition = this._renderer.worldShader.getUniformLocation( "u_projection" );
        gl.uniformMatrix4fv( projectionPosition, false, projection.toArray());

   
        let viewPosition = this._renderer.worldShader.getUniformLocation( "u_view" );
        gl.uniformMatrix4fv( viewPosition, false, viewMatrix.toArray());
         

        scene.render( this._renderer.worldShader, projection, viewMatrix);

        this._renderer.EndRender();
    }
}