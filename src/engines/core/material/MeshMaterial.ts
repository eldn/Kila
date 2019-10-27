import { MaterialBase } from "./MaterialBase";
import { Texture } from "../graphics/Texture";
import { Color } from "../graphics/Color";
import { TextureManager } from "../graphics/TextureManager";
import { MeshShader } from "../gl/shaders/MeshShader";
import { MaterialConfigBase } from "./MaterialConfigBase";

export class MeshMaterialConfig extends MaterialConfigBase{

    public diffuse: string;
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

        if (json.diffuse !== undefined) {
            config.diffuse = String(json.diffuse);
        }

        return config;
    }
}

export class MeshMaterial extends MaterialBase {

    private _diffuseTextureName: string;
    private _diffuseTexture: Texture;
    private _tint: Color;

    /**
     * Creates a new material.
     * @param name The name of this material.
     * @param diffuseTextureName The name of the diffuse texture.
     * @param tint The color value of the tint to apply to the material.
     */
    public constructor(name: string, diffuseTextureName: string, tint: Color) {
        super(name);
        this._diffuseTextureName = diffuseTextureName;
        this._tint = tint;

        if (this._diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }

        this.shader = new MeshShader();
    }

    /**
     * Creates a material from the provided configuration.
     * @param config The configuration to create a material from.
     */
    public static FromConfig(config: MeshMaterialConfig): MeshMaterial {
        let m = new MeshMaterial(config.name, config.diffuse, config.tint);
        return m;
    }

    /** The color value of the tint to apply to the material. */
    public get tint(): Color {
        return this._tint;
    }

      /** The name of the diffuse texture. */
      public get diffuseTextureName(): string {
        return this._diffuseTextureName;
    }

    /** The diffuse texture. */
    public get diffuseTexture(): Texture {
        return this._diffuseTexture;
    }

    /** Sets the diffuse texture name, which triggers a texture load if need be. */
    public set diffuseTextureName(value: string) {
        if (this._diffuseTexture !== undefined) {
            TextureManager.releaseTexture(this._diffuseTextureName);
        }

        this._diffuseTextureName = value;

        if (this._diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }
    }

    /** Destroys this material. */
    public destroy(): void {
        super.destroy();
    }
}