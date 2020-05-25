import { Vector3 } from "../math/Vector3";
import { log } from "../utils/Log";
import { Mesh } from "../core/Mesh";
import { Camera } from "../camera/Camera";


const tempVector3 = new Vector3();

const opaqueSort = function(meshA : Mesh, meshB : Mesh) {
    // sort by material renderOrder
    const renderOrderA = meshA.material.renderOrder;
    const renderOrderB = meshB.material.renderOrder;
    if (renderOrderA !== renderOrderB) {
        return renderOrderA - renderOrderB;
    }

    // sort by shader id
    const shaderNumIdA = meshA.material._shaderNumId || 0;
    const shaderNumIdB = meshB.material._shaderNumId || 0;
    if (shaderNumIdA !== shaderNumIdB) {
        return shaderNumIdA - shaderNumIdB;
    }

    // sort by render z
    return meshA._sortRenderZ - meshB._sortRenderZ;
}

const transparentSort = function(meshA : Mesh, meshB : Mesh) {
    // sort by material renderOrder
    const renderOrderA = meshA.material.renderOrder;
    const renderOrderB = meshB.material.renderOrder;
    if (renderOrderA !== renderOrderB) {
        return renderOrderA - renderOrderB;
    }

    // sort by inverse render z
    return meshB._sortRenderZ - meshA._sortRenderZ;
}

/**
 * 渲染列表
 * @class
 */
export class RenderList{

    /**
     * 不透明物体列表
     * @type {Array}
     */
    opaqueList : Array<Mesh>;

    /**
     * 透明物体列表
     * @type {Array}
     */
    transparentList : Array<Mesh>;

    /**
     * @constructs
     */
    constructor() {
        
        this.opaqueList = [];

       
        this.transparentList = [];
    }

    getClassName() : string{
        return "RenderList";
    }

    /**
     * 重置列表
     */
    reset() {
        this.opaqueList.length = 0;
        this.transparentList.length = 0;
    }

    /**
     * 遍历列表执行回调
     * @param  {RenderList~traverseCallback} callback callback(mesh)nstancedCallback(instancedMeshes)
     */
    traverse(callback) {
        this.opaqueList.forEach((mesh) => {
            callback(mesh);
        });

        this.transparentList.forEach((mesh) => {
            callback(mesh);
        });
    }

    sort() {
        this.transparentList.sort(transparentSort);
        this.opaqueList.sort(opaqueSort);
    }

    /**
     * 增加 mesh
     * @param {Mesh} mesh
     * @param {Camera} camera
     */
    addMesh(mesh : Mesh, camera : Camera) {
        const material = mesh.material;
        const geometry = mesh.geometry;

        if (material && geometry) {
           
            mesh.worldMatrix.getTranslation(tempVector3);
            tempVector3.transformMat4(camera.viewProjectionMatrix);
            mesh._sortRenderZ = tempVector3.z;

            if (material.transparent) {
                this.transparentList.push(mesh);
            } else {
                this.opaqueList.push(mesh);
            }
            
        } else {
            log.warnOnce(`RenderList.addMesh(${mesh.id})`, 'Mesh must have material and geometry', mesh);
        }
    }
}

export default RenderList;

/**
 * @callback RenderList~traverseCallback
 * @param {Mesh} mesh
 */

/**
 * @callback RenderList~instancedTraverseCallback
 * @param {Mesh[]} meshes
 */
