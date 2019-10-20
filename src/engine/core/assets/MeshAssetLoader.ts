import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";
import { AssetManager } from "./AssetManager";


export class MeshAsset implements IAsset {

    public readonly name: string;
    public readonly data: any;


    public constructor( name: string, data: any ) {
        this.name = name;
        this.data = data;
    }
}


export class MeshAssetLoader implements IAssetLoader {

    public get supportedExtensions(): string[] {
        return ["obj"];
    }

    public loadAsset( assetName: string ): void {
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open("GET", assetName);
        request.addEventListener("load", this.onMeshLoaded.bind(this, assetName, request));
        request.send();
    }

    private onMeshLoaded( assetName: string, request: XMLHttpRequest ): void {
        if (request.readyState === request.DONE) {
            let asset = new MeshAsset(assetName, request.responseText);
            AssetManager.onAssetLoaded(asset);
        }
    }
}