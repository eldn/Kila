import { Message } from "../message/Message";
import { MESSAGE_ASSET_LOADER_ASSET_LOADED, AssetManager } from "../assets/AssetManager";
import { JsonAsset } from "../assets/JsonAssetLoader";
import { MaterialReferenceNode } from "./MaterialReferenceNode";
import { MaterialConfigBase } from "./MaterialConfigBase";
import { MaterialBase } from "./MaterialBase";
import { SpriteMaterial, SpriteMaterialConfig } from "./SpriteMaterial";
import { MeshMaterial, MeshMaterialConfig } from "./MeshMaterial";




export class MaterialManager {

    private static _configLoaded: boolean = false;
    private static _materials: { [name: string]: MaterialReferenceNode } = {};
    private static _materialConfigs: { [name: string]: MaterialConfigBase } = {};


    private constructor() {
    }

    public static get isLoaded(): boolean {
        return MaterialManager._configLoaded;
    }

   
    public static onMessage(message: Message): void {

        // TODO: one for each asset.
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/materials/baseMaterials.json") {
            Message.unsubscribeCallback(MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/materials/baseMaterials.json",
                MaterialManager.onMessage);

            MaterialManager.processMaterialAsset(message.context as JsonAsset);
        }
    }

    public static load(): void {

        // Get the asset(s). TODO: This probably should come from a central asset manifest.
        let asset = AssetManager.getAsset("assets/materials/baseMaterials.json");
        if (asset !== undefined) {
            MaterialManager.processMaterialAsset(asset as JsonAsset);
        } else {

            // Listen for the asset load.
            Message.subscribeCallback(MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/materials/baseMaterials.json",
                MaterialManager.onMessage);
        }
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

    private static processMaterialAsset(asset: JsonAsset): void {

        let materials = asset.data.materials;
        if (materials) {
            for (let material of materials) {

                let c : MaterialConfigBase;

                // TODO 可自动扩展的material 的创建方式
                switch(material.name){
                    case 'SpriteMaterial':
                        c = SpriteMaterialConfig.fromJson(material);
                        break;
                    case 'MeshMaterial':
                        c = MeshMaterialConfig.fromJson(material);
                        break;
                }
            
                MaterialManager.registerMaterial(c);
            }
        }

        // TODO: Should only set this if ALL queued assets have loaded.
        MaterialManager._configLoaded = true;
    }
}