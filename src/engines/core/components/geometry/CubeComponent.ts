import { IComponentData } from "../IComponentData";
import { Color } from "../../graphics/Color";
import { IComponentBuilder } from "../IComponentBuilder";
import { IComponent } from "../IComponent";
import { BaseComponent } from "../BaseComponent";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { Cube } from "../../graphics/geometry/Cube";

export class CubeRendererCoponentData implements IComponentData {
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


export class CubeRendererComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return "cube";
    }

    public buildFromJson(json: any): IComponent {
        let data = new CubeRendererCoponentData();
        data.setFromJson(json);
        return new CubeRendererComponent(data);
    }
}


export class CubeRendererComponent extends BaseComponent {

    private _cube: Cube;

    public constructor(data: CubeRendererCoponentData) {
        super(data);

        this._cube = new Cube(data.name, data.color);
    }

    public load(): void {
        this._cube.load();
    }

    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {

       
        
        this._cube.draw(shader, this.owner.worldMatrix, projection, viewMatrix);
        super.render(shader, projection, viewMatrix);
    }
}