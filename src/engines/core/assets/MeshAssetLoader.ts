import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";
import { AssetManager } from "./AssetManager";


export class MeshAsset implements IAsset {
    public readonly name : string;
    public readonly path: string;
    public readonly data: any;


    public constructor( path : string, data: any ) {
        this.path = path;
        this.data = data;
        this.name = path.split('/').pop().toLowerCase()
    }
}


export class MeshAssetLoader implements IAssetLoader {

    public get supportedExtensions(): string[] {
        return ["obj"];
    }

    public loadAsset( assetPath: string ): void {
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open("GET", assetPath);
        request.addEventListener("load", this.onMeshLoaded.bind(this, assetPath, request));
        request.send();
    }

    private onMeshLoaded( assetPath: string, request: XMLHttpRequest ): void {
        if (request.readyState === request.DONE) {
            let asset = new MeshAsset(assetPath, request.responseText);
            AssetManager.onAssetLoaded(asset);
        }
    }
}