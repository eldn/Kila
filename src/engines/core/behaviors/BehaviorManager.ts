import { IBehaviorBuilder } from "./IBehaviorBuilder";
import { IBehavior } from "./IBehavior";
import { FirstPersonCameraBehaviorBuilder } from "./FirstPersonCameraBehavior";
import { KeyboardMovementBehaviorBuilder } from "./KeyboardMovementBehavior";
import { MouseClickBehaviorBuilder } from "./MouseClickBehavior";
import { RotationBehaviorBuilder } from "./RotationBehavior";
import { VisibilityOnMessageBehaviorBuilder } from "./VisibilityOnMessageBehavior";

export class BehaviorManager {
    private static _registeredBuilders: { [type: string]: IBehaviorBuilder } = {};

    public static registerBuilder(builder: IBehaviorBuilder): void {
        BehaviorManager._registeredBuilders[builder.type] = builder;
    }

  
    public static extractBehavior(json: any): IBehavior {
        if (json.type !== undefined) {
            if (BehaviorManager._registeredBuilders[String(json.type)] !== undefined) {
                return BehaviorManager._registeredBuilders[String(json.type)].buildFromJson(json);
            }

            throw new Error("Behavior manager error - type is missing or builder is not registered for this type.");
        }
    }

    public static initialize() : void{
        // Auto-registers the builder.
        BehaviorManager.registerBuilder(new KeyboardMovementBehaviorBuilder());

        // Auto-register the builder.
        BehaviorManager.registerBuilder(new MouseClickBehaviorBuilder());

        BehaviorManager.registerBuilder(new RotationBehaviorBuilder());

        BehaviorManager.registerBuilder(new VisibilityOnMessageBehaviorBuilder());
        BehaviorManager.registerBuilder(new FirstPersonCameraBehaviorBuilder());
    }
}