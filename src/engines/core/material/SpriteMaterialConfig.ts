import { MaterialConfigBase } from "./MaterialConfigBase";
import { Color } from "../graphics/Color";

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