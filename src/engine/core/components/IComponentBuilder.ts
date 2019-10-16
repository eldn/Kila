import { IComponent } from "./IComponent";


export interface IComponentBuilder {
    readonly type: string;
    buildFromJson(json: any): IComponent;
}
