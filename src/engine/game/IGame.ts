import { Shader } from "../core/gl/shaders/Shader";
import { Scene } from "../core/world/Scene";

export interface IGame {

    /** 
     * Called before the main update loop, after updateReady has been called on the engine subsystems. 
     * Used for loading the first/initial level, etc.
     */
    updateReady(): void;

    /**
     * Performs update procedures on this game. Called after all engine subsystems have updated.
     * @param time The delta time in milliseconds since the last update.
     */
    update(time: number): void;

    /**
     * Renders this game. Called after all engine subsystems have rendered.
     * @param shader The shader to be used during this render.
     */
    render(shader: Shader): void;


    getRunningScene() : Scene;
}