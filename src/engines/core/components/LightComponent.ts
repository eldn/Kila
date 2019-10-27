import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./BaseComponent";
import { Mesh } from "../graphics/Mesh";
import { Shader } from "../gl/shaders/Shader";
import { Matrix4x4 } from "../math/Matrix4x4";
import { DirectionLight } from "../world/lights/DirectionLight";
import { Color } from "../graphics/Color";

export class LightRendererCoponentData implements IComponentData {
    public name: string;
    public color: Color;

    public setFromJson(json: any): void {
        
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.color !== undefined) {
            this.color = Color.fromJson(json.color);
        }
    }
}


export class LightRendererComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return "light";
    }

    public buildFromJson(json: any): IComponent {
        let data = new LightRendererCoponentData();
        data.setFromJson(json);
        return new LightRendererComponent(data);
    }
}


export class LightRendererComponent extends BaseComponent {

    private _light: DirectionLight;

    public constructor(data: LightRendererCoponentData) {
        super(data);

        this._light = new DirectionLight(data.name, data.color);
    }

    public load(): void {
        this._light.load();
    }

    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        this._light.draw(shader, this.owner.worldMatrix, projection, viewMatrix);
        super.render(shader, projection, viewMatrix);
    }
}