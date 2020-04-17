import { Scene } from "./Scene";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/AssetManager";
import { JsonAsset } from "../assets/JsonAssetLoader";
import { Message } from "../message/Message";
import { Shader } from "../gl/shaders/Shader";
import { BaseCamera } from "./cameras/BaseCamera";
import { Matrix4x4 } from "../math/Matrix4x4";

export class SceneManager {

    private static _activeLevel: Scene;

    /** Private constructor to enforce singleton pattern. */
    private constructor() {

    }

    /** Gets the active camera for the active level. */
    public static get activeLevelActiveCamera(): BaseCamera {
        if (SceneManager._activeLevel !== undefined && SceneManager._activeLevel.isLoaded) {
            return SceneManager._activeLevel.activeCamera;
        }

        return undefined;
    }

    public static get activeLevel(): Scene {
        if (SceneManager._activeLevel !== undefined && SceneManager._activeLevel.isLoaded) {
            return SceneManager._activeLevel;
        }
        return undefined;
    }

    /**
     * Changes the active level to the one with the provided name.
     * @param name The name of the level to change to.
     */
    public static runScene(name: string, desc: string): void {

        if (SceneManager._activeLevel !== undefined) {
            SceneManager._activeLevel.onDeactivated();
            SceneManager._activeLevel.unload();
            SceneManager._activeLevel = undefined;
        }

        SceneManager._activeLevel = new Scene(name, desc);
        SceneManager._activeLevel.onActivated();
        SceneManager._activeLevel.load();
    }

    /**
     * Updates this manager.
     * @param time The delta time in milliseconds since the last update.
     */
    public static update(time: number): void {
        if (SceneManager._activeLevel !== undefined) {
            SceneManager._activeLevel.update(time);
        }
    }

    /**
     * Renders the level with the provided shader.
     * @param shader The shader to render with.
     */
    public static render(shader: Shader, projection: Matrix4x4, viewMatrix: Matrix4x4): void {
        if (SceneManager._activeLevel !== undefined) {
            SceneManager._activeLevel.render(shader, projection, viewMatrix);
        }
    }

    public static getViewMatrix(): Matrix4x4 {
        let view: Matrix4x4;
        if ( SceneManager.activeLevelActiveCamera !== undefined) {
            view = SceneManager.activeLevelActiveCamera.view;
        } else {
            view = Matrix4x4.identity();
        }
        return view;
    }


}