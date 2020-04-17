import { GameObject } from "../GameObject";
import { SceneGraph } from "../SceneGraph";
import { Matrix4x4 } from "../../math/Matrix4x4";

export abstract class BaseCamera extends GameObject {

    /**
     * Creates a new camera.
     * @param name The name of this camera.
     * @param sceneGraph The scene graph to be used with this camera.
     */
    public constructor(name: string, sceneGraph?: SceneGraph) {
        super(name, sceneGraph);

    }

    /** Returns the view for this camera. */
    public get view(): Matrix4x4 {
        return this.transform.getTransformationMatrix();
    }
}