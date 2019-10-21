import { Mesh } from "./Mesh";


class MeshReferenceNode {

    /** The referenced Texture. */
    public mesh: Mesh;

    /** The number of times the Texture is referenced. Default is 1 because this is only created when a Texture is needed. */
    public referenceCount: number = 1;

    /**
     * Creates a new MeshReferenceNode.
     * @param mesh The mesh to be referenced.
     */
    public constructor(mesh: Mesh) {
        this.mesh = mesh;
    }
}


export class MeshManager {

    private static _meshes: { [name: string]: MeshReferenceNode } = {};

    /** Private to enforce singleton pattern. */
    private constructor() {
    }

    /**
     * Gets a Texture with the given name. This is case-sensitive. If no Texture is found, undefined is returned.
     * Also increments the reference count by 1.
     * @param textureName The name of the texture to get. If one is not found, a new one is created, using this as the texture path.
     */
    public static getMesh(meshName: string): Mesh {
        if (MeshManager._meshes[meshName] === undefined) {
            let mesh = new Mesh(meshName);
            MeshManager._meshes[meshName] = new MeshReferenceNode(mesh);
        } else {
            MeshManager._meshes[meshName].referenceCount++;
        }

        return MeshManager._meshes[meshName].mesh;
    }

    /**
     * Releases a reference of a Texture with the provided name and decrements the reference count. 
     * If the Texture's reference count is 0, it is automatically released. 
     * @param textureName The name of the Texture to be released.
     */
    public static releaseMesh(meshName: string): void {
        if (MeshManager._meshes[meshName] === undefined) {
            console.warn(`A mesh named ${meshName} does not exist and therefore cannot be released.`);
        } else {
            MeshManager._meshes[meshName].referenceCount--;
            if (MeshManager._meshes[meshName].referenceCount < 1) {
                // TODO
                // MeshManager._meshes[meshName].mesh.destroy();
                MeshManager._meshes[meshName] = undefined;
                delete MeshManager._meshes[meshName];
            }
        }
    }
}