import { Message } from "../message/Message";
import { MESSAGE_ASSET_LOADER_ASSET_LOADED, AssetManager } from "../assets/AssetManager";
import { JsonAsset } from "../assets/JsonAssetLoader";
import { MaterialReferenceNode } from "./MaterialReferenceNode";
import { MaterialConfigBase } from "./MaterialConfigBase";
import { MaterialBase } from "./MaterialBase";
import { SpriteMaterial, SpriteMaterialConfig } from "./SpriteMaterial";
import { MeshMaterial, MeshMaterialConfig } from "./MeshMaterial";




export class MaterialManager {

    private static _materials: { [name: string]: MaterialReferenceNode } = {};
    private static _materialConfigs: { [name: string]: MaterialConfigBase } = {};

    private constructor() {

    }

    public static registerMaterial(materialConfig: MaterialConfigBase): void {
        if (MaterialManager._materialConfigs[materialConfig.name] === undefined) {
            MaterialManager._materialConfigs[materialConfig.name] = materialConfig;
        }
    }

 
    public static getMaterial(materialName: string): MaterialBase {
        if (MaterialManager._materials[materialName] === undefined) {

            // Check if a config is registered.
            if (MaterialManager._materialConfigs[materialName] !== undefined) {

                let mat : MaterialBase;

                // TODO 可自动扩展的material 的创建方式
                switch(materialName){
                    case 'SpriteMaterial':
                        mat = SpriteMaterial.FromConfig(MaterialManager._materialConfigs[materialName] as SpriteMaterialConfig);
                        break;
                    case 'MeshMaterial':
                        mat = MeshMaterial.FromConfig(MaterialManager._materialConfigs[materialName] as MeshMaterialConfig);
                        break;
                }
                
                MaterialManager._materials[materialName] = new MaterialReferenceNode(mat);
                return MaterialManager._materials[materialName].material;
            }
            return undefined;
        } else {
            MaterialManager._materials[materialName].referenceCount++;
            return MaterialManager._materials[materialName].material;
        }
    }

 
    public static releaseMaterial(materialName: string): void {
        if (MaterialManager._materials[materialName] === undefined) {
            console.warn("Cannot release a material which has not been registered.");
        } else {
            MaterialManager._materials[materialName].referenceCount--;
            if (MaterialManager._materials[materialName].referenceCount < 1) {
                MaterialManager._materials[materialName].material.destroy();
                MaterialManager._materials[materialName].material = undefined;
                delete MaterialManager._materials[materialName];
            }
        }
    }
}