import { SceneGraph } from "./SceneGraph";
import { Shader } from "../gl/shaders/Shader";
import { GameObject } from "./GameObject";
import { Camera } from "./cameras/Camera";
import { PerspectiveCamera } from "./cameras/PerspectiveCamera";
import { Dictionary } from "../Types";
import { LightRendererComponent } from "../components/LightComponent";
import { SkyBox } from "./Skybox";
import { Matrix4 } from "../math/Matrix4";
import { Vector3 } from "../math/Vector3";

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

    /**
     * Creates a new level.
     * @param name The name of this level.
     * @param description A brief description of this level. 
     * Could be used on level selection screens for some games.
     */
    public constructor(camera : Camera) {
        this._sceneGraph = new SceneGraph();
        this._activeCamera = camera;
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
}