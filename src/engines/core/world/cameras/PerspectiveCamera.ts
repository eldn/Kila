import { BaseCamera } from "./BaseCamera";

import { SceneGraph } from "../SceneGraph";

export class PerspectiveCamera extends BaseCamera {

    public constructor(name: string, sceneGraph?: SceneGraph) {
        super(name, sceneGraph);
    }
}