import { IBehavior } from "./IBehavior";

export interface IBehaviorBuilder {

    readonly type: string;

    buildFromJson(json: any): IBehavior;
}