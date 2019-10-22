import { MaterialBase } from "./MaterialBase";
import { Texture } from "../graphics/Texture";
import { Color } from "../graphics/Color";
import { TextureManager } from "../graphics/TextureManager";
import { MeshShader } from "../gl/shaders/MeshShader";
import { MaterialConfigBase } from "./MaterialConfigBase";

export class MeshMaterialConfig extends MaterialConfigBase{

    public diffuse: string;
    public specular: string;
    public tint: Color;

    public static fromJson(json: any): MeshMaterialConfig {
        let config = new MeshMaterialConfig();
        if (json.name !== undefined) {
            config.name = String(json.name);
        }

        if (json.tint !== undefined) {
            config.tint = Color.fromJson(json.tint);
        } else {
            config.tint = Color.white();
        }

        return config;
    }
}

export class MeshMaterial extends MaterialBase {

    private _tint: Color;

    /**
     * Creates a new material.
     * @param name The name of this material.
     * @param diffuseTextureName The name of the diffuse texture.
     * @param tint The color value of the tint to apply to the material.
     */
    public constructor(name: string, tint: Color) {
        super(name);
        this._tint = tint;

        this.shader = new MeshShader();
    }

    /**
     * Creates a material from the provided configuration.
     * @param config The configuration to create a material from.
     */
    public static FromConfig(config: MeshMaterialConfig): MeshMaterial {
        let m = new MeshMaterial(config.name, config.tint);
        return m;
    }

    /** The color value of the tint to apply to the material. */
    public get tint(): Color {
        return this._tint;
    }

    /** Destroys this material. */
    public destroy(): void {
        super.destroy();
    }
}