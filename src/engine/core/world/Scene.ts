import { SceneGraph } from "./SceneGraph";
import { Shader } from "../gl/shaders/Shader";
import { GameObject } from "./GameObject";
import { Camera } from "./cameras/Camera";
import { Matrix4 } from "../math/Matrix4";
import { Renderer } from "../renderering/Renderer";
import { gl } from "../gl/GLUtilities";
import { semantic } from "../renderering/Semantic";
import { PerspectiveCamera } from "./cameras/PerspectiveCamera";

export enum LevelState {

    /** The level is not yet initialized. */
    UNINITIALIZED,

    /** The level is currently loading. */
    LOADING,

    /** The level is loaded and is currently updating. */
    UPDATING
}


export class Scene {

    private _sceneGraph: SceneGraph;
    private _state: LevelState = LevelState.UNINITIALIZED;
    private _activeCamera: Camera;
    private _renderer : Renderer;

    /**
     * Creates a new level.
     * @param name The name of this level.
     * @param description A brief description of this level. 
     * Could be used on level selection screens for some games.
     */
    public constructor(camera : Camera, render : Renderer) {
        this._sceneGraph = new SceneGraph();
        this._activeCamera = camera;
        this._renderer = render;
    }


    /** The SceneGraph of this level. */
    public get sceneGraph(): SceneGraph {
        return this._sceneGraph;
    }

    /** The currently active camera. */
    public get activeCamera(): Camera {
        return this._activeCamera;
    }

    /** Indicates if this level is loaded. */
    public get isLoaded(): boolean {
        return this._state === LevelState.UPDATING;
    }

    addObject(obj : GameObject) : void {
        if(this._sceneGraph && obj){
          this.sceneGraph.addObject(obj);  
        }
      }


    /** Loads this level. */
    public load(): void {
        this._state = LevelState.LOADING;

        this._sceneGraph.load();
        this._sceneGraph.root.updateReady();

        this._state = LevelState.UPDATING;
    }

    /** Unloads this level. */
    public unload(): void {

    }

    public tick(delta : number) : void {
        this.update(delta);


        semantic.init(this._renderer, this._renderer.state, this._activeCamera, null, null);
        this._activeCamera.updateViewProjectionMatrix();
        

        let projection : Matrix4 = this._activeCamera.projectionMatrix;
        let viewMatrix : Matrix4 = this._activeCamera.viewMatrix;
        
        // Set view uniforms.
        let projectionPosition = this._renderer.worldShader.getUniformLocation( "u_projection" );
        gl.uniformMatrix4fv( projectionPosition, false, projection.toArray());

   
        let viewPosition = this._renderer.worldShader.getUniformLocation( "u_view" );
        gl.uniformMatrix4fv( viewPosition, false, viewMatrix.toArray());
         
        this._renderer.BeginRender();

        this.render(this._renderer.worldShader, projection, viewMatrix);

        this._renderer.EndRender();
    }

    /**
     * Updates this level.
     * @param time The delta time in milliseconds since the last update.
     */
    public update(time: number): void {
        if (this._state === LevelState.UPDATING) {
            this._sceneGraph.update(time);
        }
    }

    /**
     * Renders this level.
     * @param shader The shader to use when rendering.
     */
    public render(shader: Shader, projection : Matrix4, viewMatrix : Matrix4): void {
        if (this._state === LevelState.UPDATING) {
            this._sceneGraph.render( shader, projection, viewMatrix);
        }
    }

    /** Called when this level is activated. */
    public onActivated(): void {

    }

    /** Called when this level is deactivated. */
    public onDeactivated(): void {
        
    }

    public resize() : void{
        this._renderer.Resize();

        if(this._activeCamera instanceof PerspectiveCamera){
            this._activeCamera.aspect = this._renderer.canvasWitdh / this._renderer.canvasHeight;
        }
        
    }
}