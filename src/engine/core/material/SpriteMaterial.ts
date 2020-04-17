import { MaterialBase } from "./MaterialBase";
import { Texture } from "../graphics/Texture";
import { Color } from "../graphics/Color";
import { TextureManager } from "../graphics/TextureManager";
import { SpriteShader } from "../gl/shaders/SpriteShader";
import { MaterialConfigBase } from "./MaterialConfigBase";


 export class SpriteMaterialConfig extends MaterialConfigBase{

    public diffuse: string;
    public specular: string;
    public tint: Color;

    public static fromJson(json: any): SpriteMaterialConfig {

        let config = new SpriteMaterialConfig();
        if (json.name !== undefined) {
            config.name = String(json.name);
        }

        if (json.diffuse !== undefined) {
            config.diffuse = String(json.diffuse);
        }

        if (json.specular !== undefined) {
            config.specular = String(json.specular);
        }

        if (json.tint !== undefined) {
            config.tint = Color.fromJson(json.tint);
        } else {
            config.tint = Color.white();
        }

        return config;
    }
}

export class SpriteMaterial extends MaterialBase {

    private _diffuseTextureName: string;
    private _diffuseTexture: Texture;
    private _tint: Color;

    /**
     * Creates a new material.
     * @param name The name of this material.
     * @param diffuseTextureName The name of the diffuse texture.
     */
    public constructor(name: string, diffuseTextureName: string) {
        super(name);
        this._diffuseTextureName = diffuseTextureName;

        if (this._diffuseTextureName !== undefined) {
            this._diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
        }
    }

    /**
     * Creates a material from the provided configuration.
     * @param config The configuration to create a material from.
     */
    public static FromConfig(config: SpriteMaterialConfig): SpriteMaterial {
        let m = new SpriteMaterial(config.name, config.diffuse);
        return m;
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
        TextureManager.releaseTexture(this._diffuseTextureName);
        this._diffuseTexture = undefined;
    }
}