import { Mesh } from "../core/Mesh";
import VertexArrayObject from "./VertexArrayObject";
import Shader from "../shader/shader";
import Program from "./Program";
import GLBuffer from "./GLBuffer";


/**
 * WebGLResourceManager 资源管理器
 */
export class WebGLResourceManager{

    /**
     * 是否有需要销毁的资源
     */
    hasNeedDestroyResource: boolean = false;


    private _usedResourceDict : Object;

    private _needDestroyDict : Object;


    constructor() {
       
    }

    public getClassName() : string{
        return "WebGLResourceManager";
    }

    /**
     * 标记使用资源
     * @param  res
     * @param  mesh 使用资源的mesh
     * @return  this
     */
    public useResource(res : VertexArrayObject | Shader | Program | GLBuffer, mesh : Mesh) : WebGLResourceManager{
        if (res) {
            const key = res.getClassName() + ':' + res.id;
            if (!this._usedResourceDict[key]) {
                this._usedResourceDict[key] = res;

                if (res instanceof VertexArrayObject) {
                    res.useResource(this, mesh);
                }
            }
        }

        if (mesh) {
            mesh.useResource(res);
        }

        return this;
    }

    /**
     * 没有引用时销毁资源
     * @param   res
     * @return this
     */
    public destroyIfNoRef(res : VertexArrayObject | Shader | Program | GLBuffer) : WebGLResourceManager {
        if (!this._needDestroyDict) {
            this._needDestroyDict = {};
        }

        if (res) {
            this.hasNeedDestroyResource = true;
            this._needDestroyDict[res.getClassName() + ':' + res.id] = res;
        }

        return this;
    }


    /**
     * 销毁没被使用的资源
     * @return  this
     */
    public destroyUnsuedResource() : WebGLResourceManager {
        if (!this.hasNeedDestroyResource) {
            return this;
        }

        const _needDestroyDict = this._needDestroyDict;
        const _usedResourceDict = this._usedResourceDict;
        for (let key in _needDestroyDict) {
            if (!_usedResourceDict[key]) {
                const res = _needDestroyDict[key];
                if (res && !res.alwaysUse && res.destroy) {
                    res.destroy();
                }
            }
        }

        this._needDestroyDict = {};
        this.hasNeedDestroyResource = false;
        return this;
    }

    /**
     * 重置
     * @return this
     */
    public reset() : WebGLResourceManager {
        this._usedResourceDict = {};

        return this;
    }
}

export default WebGLResourceManager;
