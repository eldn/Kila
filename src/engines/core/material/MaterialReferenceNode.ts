import { MaterialBase } from "./MaterialBase";

export class MaterialReferenceNode {

    public material: MaterialBase;

    public referenceCount: number = 1;

    public constructor(material: MaterialBase) {
        this.material = material;
    }
}