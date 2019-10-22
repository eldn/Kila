import { Level } from "./Level";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/AssetManager";
import { JsonAsset } from "../assets/JsonAssetLoader";
import { Message } from "../message/Message";
import { Shader } from "../gl/shaders/Shader";
import { BaseCamera } from "./cameras/BaseCamera";
import { Matrix4x4 } from "../math/Matrix4x4";

export class LevelManager {

    private static _registeredLevels: { [name: string]: string } = {};
    private static _activeLevel: Level;
    private static _configLoaded: boolean = false;

    /** Private constructor to enforce singleton pattern. */
    private constructor() {
    }

    /** Indicates if this manager is loaded. */
    public static get isLoaded(): boolean {
        return LevelManager._configLoaded;
    }

    /** Gets the active camera for the active level. */
    public static get activeLevelActiveCamera(): BaseCamera {
        if (LevelManager._activeLevel !== undefined && LevelManager._activeLevel.isLoaded) {
            return LevelManager._activeLevel.activeCamera;
        }

        return undefined;
    }

    /** Loads this manager. */
    public static load(): void {

        // Get the asset(s). TODO: This probably should come from a central asset manifest.
        let asset = AssetManager.getAsset("assets/levels/levels.json");
        if (asset !== undefined) {
            LevelManager.processLevelConfigAsset(asset as JsonAsset);
        } else {
            // Listen for the asset load.
            Message.subscribeCallback(MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/levels/levels.json", LevelManager.onMessage);
        }
    }

    /**
     * Changes the active level to the one with the provided name.
     * @param name The name of the level to change to.
     */
    public static changeLevel(name: string): void {
        if (LevelManager._activeLevel !== undefined) {
            LevelManager._activeLevel.onDeactivated();
            LevelManager._activeLevel.unload();
            LevelManager._activeLevel = undefined;
        }

        // Make sure the level is registered.
        if (LevelManager._registeredLevels[name] !== undefined) {

            // If the level asset is already loaded, get it and use it to load the level.
            // Otherwise, retrieve the asset and load the level upon completion.
            if (AssetManager.isAssetLoaded(LevelManager._registeredLevels[name])) {
                let asset = AssetManager.getAsset(LevelManager._registeredLevels[name]);
                LevelManager.loadLevel(asset);
            } else {
                Message.subscribeCallback(MESSAGE_ASSET_LOADER_ASSET_LOADED + LevelManager._registeredLevels[name], LevelManager.onMessage);
                AssetManager.loadAsset(LevelManager._registeredLevels[name]);
            }
        } else {
            throw new Error("Level named:" + name + " is not registered.");
        }
    }

    /**
     * Updates this manager.
     * @param time The delta time in milliseconds since the last update.
     */
    public static update(time: number): void {
        if (LevelManager._activeLevel !== undefined) {
            LevelManager._activeLevel.update(time);
        }
    }

    /**
     * Renders the level with the provided shader.
     * @param shader The shader to render with.
     */
    public static render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        if (LevelManager._activeLevel !== undefined) {
            LevelManager._activeLevel.render(shader, projection, viewMatrix);
        }
    }

    /**
     * The message handler.
     * @param message The message to be handled.
     */
    public onMessage(message: Message): void {

    }

    /**
     * The message handler.
     * @param message The message to be handled.
     */
    public static onMessage(message: Message): void {

        // TODO: one for each asset.
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/levels/levels.json") {
            Message.unsubscribeCallback(MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/levels/levels.json",
                LevelManager.onMessage);

            LevelManager.processLevelConfigAsset(message.context as JsonAsset);
        } else if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) !== -1) {
            console.log("Level loaded:" + message.code);
            let asset = message.context as JsonAsset;
            LevelManager.loadLevel(asset);
        }
    }

    private static loadLevel(asset: JsonAsset): void {
        console.log("Loading level:" + asset.name);
        let data = asset.data;

        let levelName: string;
        if (data.name === undefined) {
            throw new Error("Zone file format exception: Zone name not present.");
        } else {
            levelName = String(data.name);
        }

        let description: string;
        if (data.description !== undefined) {
            description = String(data.description);
        }

        LevelManager._activeLevel = new Level(levelName, description);
        LevelManager._activeLevel.initialize(data);
        LevelManager._activeLevel.onActivated();
        LevelManager._activeLevel.load();


        Message.send("LEVEL_LOADED", this);
    }

    private static processLevelConfigAsset(asset: JsonAsset): void {

        let levels = asset.data.levels;
        if (levels) {
            for (let level of levels) {
                if (level.name !== undefined && level.file !== undefined) {
                    LevelManager._registeredLevels[level.name] = String(level.file);
                } else {
                    throw new Error("Invalid level config file format: name or file is missing");
                }
            }
        }

        // TODO: Should only set this if ALL queued assets have loaded.
        LevelManager._configLoaded = true;
    }

    public static getViewMatrix() : Matrix4x4{
        let view: Matrix4x4;
        if ( LevelManager.isLoaded && LevelManager.activeLevelActiveCamera !== undefined ) {
            view = LevelManager.activeLevelActiveCamera.view;
        } else {
            view = Matrix4x4.identity();
        }
        return view;
    }
}