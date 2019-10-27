import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { SpriteComponentBuilder } from "./SpriteComponent";
import { MeshRendererComponentBuilder } from "./MeshRendererComponent";
import { LightRendererComponentBuilder } from "./LightComponent";

export class ComponentManager {

    private static _registeredBuilders: { [type: string]: IComponentBuilder } = {};


    public static registerBuilder(builder: IComponentBuilder): void {
        ComponentManager._registeredBuilders[builder.type] = builder;
    }

    public static extractComponent(json: any): IComponent {
        if (json.type !== undefined) {
            if (ComponentManager._registeredBuilders[String(json.type)] !== undefined) {
                return ComponentManager._registeredBuilders[String(json.type)].buildFromJson(json);
            }

            throw new Error("Component manager error - type is missing or builder is not registered for this type.");
        }
    }

    public static initialize() : void{
        ComponentManager.registerBuilder(new SpriteComponentBuilder());
        ComponentManager.registerBuilder(new MeshRendererComponentBuilder());
        ComponentManager.registerBuilder(new LightRendererComponentBuilder());
    }
}
