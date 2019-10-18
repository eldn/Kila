import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";
import { AssetManager } from "./AssetManager";


export class ObjAsset implements IAsset {

    public readonly name: string;

    public readonly data: HTMLImageElement;


    public constructor( name: string, data: HTMLImageElement ) {
        this.name = name;
        this.data = data;
    }

    public get width(): number {
        return this.data.width;
    }

    public get height(): number {
        return this.data.height;
    }
}


export class ObjAssetLoader implements IAssetLoader {

    public get supportedExtensions(): string[] {
        return ["obj"];
    }

    public loadAsset( assetName: string ): void {
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open("GET", assetName);
        request.addEventListener("load", this.onObjLoaded.bind(this, assetName, request));
        request.send();
    }

    private onObjLoaded( assetName: string, request: XMLHttpRequest ): void {
        console.log( "onObjLoaded: assetName/image", assetName );
        if (request.readyState === request.DONE) {
            let json = JSON.parse(request.responseText);
            let asset = new ObjAsset(assetName, json);
            AssetManager.onAssetLoaded(asset);
        }
    }
}