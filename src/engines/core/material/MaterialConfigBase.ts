export class MaterialConfigBase {

    public name: string;

    public static fromJson(json: any): MaterialConfigBase {
        let config = new MaterialConfigBase();
        if (json.name !== undefined) {
            config.name = String(json.name);
        }

        return config;
    }
}