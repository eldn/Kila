import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";
import { AssetManager } from "./AssetManager";


export class ModelAsset implements IAsset {
    public readonly name : string;
    public readonly data: any;


    public constructor( name : string, data: any ) {
        this.name = name;
        this.data = data;
    }
}


export class ModelAssetLoader implements IAssetLoader {

    public get supportedExtensions(): string[] {
        return ["obj","mtl"];
    }

    public loadAsset( assetPath: string ): void {
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open("GET", assetPath);
        request.addEventListener("load", this.onMeshLoaded.bind(this, assetPath, request));
        request.send();
    }

    private onMeshLoaded( assetPath: string, request: XMLHttpRequest ): void {
        if (request.readyState === request.DONE) {
            let asset = new ModelAsset(assetPath, request.responseText);
            AssetManager.onAssetLoaded(asset);
        }
    }
}