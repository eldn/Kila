import GameObject from "./GameObject";
import { WebGLRenderer } from "../renderer/WebGLRenderer";
import { Material } from "../material";
import { Geometry } from "../geometry";
import { VertexArrayObject } from "..";
import Shader from "../shader/shader";
import { Program } from "../renderer";

export class Mesh extends GameObject{

    public material : Material;
    public geometry : Geometry;

    _sortRenderZ : number;

    /**
     *store webgl resource
     */
    private _usedResourceDict : Object;

    private _isDestroyed : boolean;


    constructor(){
        super();
        this._usedResourceDict = {};
    }

    public getClassName() : string{
        return "Mesh";
    }

    public getRenderOption(opt : Object = {}) : Object {
        this.geometry.getRenderOption(opt);
        return opt;
    }

    public useResource(res :  VertexArrayObject | Shader | Program) {
        if (res) {
            this._usedResourceDict[res.getClassName() + ':' + res.id] = res;
        }
    }

    public destroy(renderer :  WebGLRenderer, needDestroyTextures : boolean = false){
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