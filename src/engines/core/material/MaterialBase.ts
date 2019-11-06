import { Shader } from "../gl/shaders/Shader";
import { MaterialConfigBase } from "./MaterialConfigBase";

export class MaterialBase {

    private _name: string;

    /**
     * Creates a new material.
     * @param name The name of this material.
     * @param diffuseTextureName The name of the diffuse texture.
     * @param tint The color value of the tint to apply to the material.
     */
    public constructor(name: string) {
        this._name = name;
    }

    /**
     * Creates a material from the provided configuration.
     * @param config The configuration to create a material from.
     */
    public static FromConfig(config: MaterialConfigBase): MaterialBase {
        let m = new MaterialBase(config.name);
        return m;
    }

    /** The name of this material. */
    public get name(): string {
        return this._name;
    }


    /** Destroys this material. */
    public destroy(): void {
      
    }
}