import { GameObject } from "./GameObject";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";

export class SceneGraph {

    private _root: GameObject;

    /** Creates a new SceneGraph */
    public constructor() {
        this._root = new GameObject("__ROOT__", this);
    }

    /** Returns the root object. */
    public get root(): GameObject {
        return this._root;
    }

    /** Indicates if this scene is loaded. */
    public get isLoaded(): boolean {
        return this._root.isLoaded;
    }

    /**
     * Adds an entity to the root entity of this scene graph.
     * @param entity The entity to be added.
     */
    public addObject(entity: GameObject): void {
        this._root.addChild(entity);
    }

    /**
     * Recursively searches this scene graph for an entity with the provided name.
     * @param name The name of the entity to retrieve.
     */
    public getEntityByName(name: string): GameObject {
        return this._root.getEntityByName(name);
    }

    /** Loads this scene graph. */
    public load(): void {
        this._root.load();
    }

    /**
     * Performs update procedures on this scene graph.
     * @param time The delta time in milliseconds since the last update.
     */
    public update(time: number): void {
        this._root.update(time);
    }

    /**
     * Renders this scene graph using the provided shader.
     * @param shader The shader to use when rendering.
     */
    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        this._root.render(shader, projection, viewMatrix);
    }
}