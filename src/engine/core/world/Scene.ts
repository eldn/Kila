import { SceneGraph } from "./SceneGraph";
import { Shader } from "../gl/shaders/Shader";
import { GameObject } from "./GameObject";
import { ComponentManager } from "../components/ComponentManager";
import { BehaviorManager } from "../behaviors/BehaviorManager";
import { Camera } from "./cameras/Camera";
import { PerspectiveCamera } from "./cameras/PerspectiveCamera";
import { Dictionary } from "../Types";
import { Matrix4x4 } from "../math/Matrix4x4";
import { LightRendererComponent } from "../components/LightComponent";
import { SkyBox } from "./Skybox";

export enum LevelState {

    /** The level is not yet initialized. */
    UNINITIALIZED,

    /** The level is currently loading. */
    LOADING,

    /** The level is loaded and is currently updating. */
    UPDATING
}


export class Scene {

    private _name: string;
    private _description: string;
    private _sceneGraph: SceneGraph;
    private _state: LevelState = LevelState.UNINITIALIZED;
    private _registeredCameras: Dictionary<Camera> = {};
    private _activeCamera: Camera;
    private _lights : LightRendererComponent[] = [];
    private _skyBox : SkyBox;

    /**
     * Creates a new level.
     * @param name The name of this level.
     * @param description A brief description of this level. 
     * Could be used on level selection screens for some games.
     */
    public constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
        this._sceneGraph = new SceneGraph();
    }

    /** The name of this level. */
    public get name(): string {
        return this._name;
    }

    /** The description of this level. */
    public get description(): string {
        return this._description;
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

        // Get registered cameras. If there aren't any, register one automatically.
        // Otherwise, look for the first one and make it active.
        // TODO: Add active camera to level config, assign by name.
        let defaultCamera = new PerspectiveCamera("DEFAULT_CAMERA");
        this._sceneGraph.addObject(defaultCamera);
        this.registerCamera(defaultCamera);
        this._activeCamera = defaultCamera;
        

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
    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        if (this._state === LevelState.UPDATING) {
            this._sceneGraph.render(shader, projection, viewMatrix);
        }
    }

    /** Called when this level is activated. */
    public onActivated(): void {

    }

    /** Called when this level is deactivated. */
    public onDeactivated(): void {
        
    }

    /**
     * Registers the provided camera with this level. Automatically sets as the active camera
     * if no active camera is currently set.
     * @param camera The camera to register.
     */
    public registerCamera(camera: Camera): void {
        if (this._registeredCameras[camera.name] === undefined) {
            this._registeredCameras[camera.name] = camera;
            if (this._activeCamera === undefined) {
                this._activeCamera = camera;
            }
        } else {
            console.warn("A camera named '" + camera.name + "' has already been registered. New camera not registered.");
        }
    }

    /**
     * Unregisters the provided camera with this level.
     * @param camera The camera to unregister.
     */
    public unregisterCamera(camera: Camera): void {
        if (this._registeredCameras[camera.name] !== undefined) {
            this._registeredCameras[camera.name] = undefined;
            if (this._activeCamera === camera) {

                // NOTE: auto-activate the next camera in line?
                this._activeCamera = undefined;
            }
        } else {
            console.warn("No camera named '" + camera.name + "' hsd been registered. Camera not unregistered.");
        }
    }
    
    public getLights() : LightRendererComponent[]{
        return this._lights;
    }

    public getSkybox() : SkyBox{
        return this._skyBox;
    }

    public getViewMatrix() : Matrix4x4{
        return this.activeCamera.view;
    }
}