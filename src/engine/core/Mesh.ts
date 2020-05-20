import GameObject from "./GameObject";
import { WebGLRenderer } from "../renderer/WebGLRenderer";

export class Mesh extends GameObject{

    material : any;
    geometry : any;

    _sortRenderZ : number;

    // store webgl resource
    private _usedResourceDict : Object;

    private _isDestroyed : boolean;


    constructor(){
        super();


        this._usedResourceDict = {};
    }

    getRenderOption(opt = {}) {
        this.geometry.getRenderOption(opt);
        return opt;
    }

    useResource(res : any) {
        if (res) {
            this._usedResourceDict[res.constructor + ':' + res.id] = res;
        }
    }


    destroy(renderer :  WebGLRenderer, needDestroyTextures : boolean = false){
        if (this._isDestroyed) {
            return this;
        }

        super.destroy(renderer, needDestroyTextures);

        const resourceManager = renderer.resourceManager;
        const _usedResourceDict = this._usedResourceDict;
        for (let id in _usedResourceDict) {
            resourceManager.destroyIfNoRef(_usedResourceDict[id]);
        }

        if (this.material && needDestroyTextures) {
            this.material.destroyTextures();
        }

        this.off();
        this._usedResourceDict = null;
        this.geometry = null;
        this.material = null;

        this._isDestroyed = true;
        return this;
    }
    
}