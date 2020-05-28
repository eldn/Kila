import { Vector3 } from "../math/Vector3";
import { Matrix3 } from "../math/Matrix3";
import { Matrix4 } from "../math/Matrix4";
import { WebGLState } from "./WebGlState";
import { Camera } from "../camera/Camera";
import { LightManager } from "../light/LightManager";
import { WebGLRenderer } from "./WebGLRenderer";
import Color from "../math/Color";
import Texture from "../texture/Texture";
import { Mesh } from "../core";
import { Material } from "../material";
import { PerspectiveCamera } from "../camera";


const tempVector3 = new Vector3();
const tempMatrix3 = new Matrix3();
const tempMatrix4 = new Matrix4();
const tempFloat32Array4 = new Float32Array([0.5, 0.5, 0.5, 1]);
const tempFloat32Array2 = new Float32Array([0, 0]);

let camera : Camera;
let gl : WebGLRenderingContext;
let lightManager : LightManager;
let state : WebGLState;
let fog;
let renderer : WebGLRenderer;

const blankInfo = {
    isBlankInfo: true,
    get() {
        return undefined;
    }
};


/**
 * 语义
 * @namespace semantic
 * @type {Object}
 */
export class semantic{
    /**
     * @type {State}
     */
    public static state: WebGLState = null;

    /**
     * @type {Camera}
     */
    public static  camera:  Camera = null;

    /**
     * @type {LightManager}
     */
    public static  lightManager: LightManager = null;

    /**
     * @type {WebGLRenderingContext}
     */
    public static  gl: WebGLRenderingContext = null;
    /**
     * WebGLRenderer
     * @type {WebGLRenderer}
     */
    private static _renderer: WebGLRenderer = null;

    /**
     * 初始化
     * @param  {State} _state
     * @param  {Camera} _camera
     * @param  {LightManager} _lightManager
     * @param  {Fog} _fog
     */
    public static init(_renderer : WebGLRenderer, _state : WebGLState, _camera : Camera, _lightManager : LightManager) {
        renderer = this._renderer = _renderer;
        state = this.state = _state;
        camera = this.camera = _camera;
        lightManager = this.lightManager = _lightManager;
        gl = this.gl = state.gl;
    }

    /**
     * 设置相机
     * @param {Camera} _camera
     */
    public static setCamera(_camera : Camera) {
        camera = this.camera = _camera;
    }

    public static handlerColorOrTexture(value : Color | Texture, textureIndex) {
        if (value && value instanceof Texture) {
            return this.handlerTexture(value, textureIndex);
        }

        if (value && value instanceof Color) {
            value.toArray(tempFloat32Array4);
        } else {
            tempFloat32Array4[0] = tempFloat32Array4[1] = tempFloat32Array4[2] = 0.5;
        }

        return tempFloat32Array4;
    }

    public static handlerTexture(value, textureIndex) {
        if (value && value instanceof Texture) {
            return this.handlerGLTexture(value.target, value.getGLTexture(state), textureIndex);
        }

        return undefined;
    }

    public static handlerGLTexture(target, texture, textureIndex) {
        if (texture) {
            state.activeTexture(gl.TEXTURE0 + textureIndex);
            state.bindTexture(target, texture);
            return textureIndex;
        }

        return undefined;
    }

    public static handlerUV(texture) {
        if (texture && texture.isTexture) {
            return texture.uv || 0;
        }

        return 0;
    }

    /**
     * @type {semanticObject}
     */
    static POSITION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.vertices;
        }
    }

    /**
     * @type {semanticObject}
     */
    static NORMAL: Object =  {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.normals;
        }
    }

    /**
     * @type {semanticObject}
     */
    static TANGENT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            const normalMap = material.normalMap;
            if (normalMap && normalMap instanceof Texture) {
                if (Number(normalMap.uv) === 1) {
                    return mesh.geometry.tangents1;
                }
                return mesh.geometry.tangents;
            }

            return undefined;
        }
    }

    /**
     * @type {semanticObject}
     */
    static TEXCOORD_0: Object =  {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!mesh.geometry.uvs) {
                return undefined;
            }
            return mesh.geometry.uvs;
        }
    }

    /**
     * @type {semanticObject}
     */
    static TEXCOORD_1: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!mesh.geometry.uvs1) {
                return undefined;
            }
            return mesh.geometry.uvs1;
        }
    }

    /**
     * @type {semanticObject}
     */
    static UVMATRIX_0: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!material.uvMatrix) {
                return undefined;
            }
            return material.uvMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    static UVMATRIX_1: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!material.uvMatrix1) {
                return undefined;
            }
            return material.uvMatrix1.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    static CAMERAFAR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (camera instanceof PerspectiveCamera) {
                return camera.far;
            }
            return undefined;
        }
    }

    /**
     * @type {semanticObject}
     */
    static CAMERANEAR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (camera  instanceof PerspectiveCamera) {
                return camera.near;
            }
            return undefined;
        }
    }

    /**
     * @type {semanticObject}
     */
    static CAMERATYPE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (camera instanceof PerspectiveCamera) {
                return 1;
            }
            return 0;
        }
    }

    static CAMERAPOSITION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.worldMatrix.getTranslation(tempVector3).elements;
        }
    }


    /**
     * @type {semanticObject}
     */
    static COLOR_0: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!mesh.geometry.colors) {
                return undefined;
            }
            return mesh.geometry.colors;
        }
    }

    // uniforms

    /**
     * @type {semanticObject}
     */
    static RENDERERSIZE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            tempFloat32Array2[0] = renderer.width;
            tempFloat32Array2[1] = renderer.height;
            return tempFloat32Array2;
        }
    }

    /**
     * @type {semanticObject}
     */
    static LOCAL: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.matrix.elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static MODEL: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.worldMatrix.elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static VIEW: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.viewMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    static PROJECTION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.projectionMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    static VIEWPROJECTION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.viewProjectionMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    static MODELVIEW: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.getModelViewMatrix(mesh, tempMatrix4).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static MODELVIEWPROJECTION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.getModelProjectionMatrix(mesh, tempMatrix4).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static MODELINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix4.invert(mesh.worldMatrix).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static VIEWINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.worldMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
    */
   static VIEWINVERSEINVERSETRANSPOSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix3.normalFromMat4(camera.worldMatrix).elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    static PROJECTIONINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix4.invert(camera.projectionMatrix).elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    static MODELVIEWINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix4.invert(camera.getModelViewMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static MODELVIEWPROJECTIONINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix4.invert(camera.getModelProjectionMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static MODELINVERSETRANSPOSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix3.normalFromMat4(mesh.worldMatrix).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static MODELVIEWINVERSETRANSPOSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix3.normalFromMat4(camera.getModelViewMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static NORMALMAPSCALE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return material.normalMapScale;
        }
    }


    // light

    /**
     * @type {semanticObject}
     */
    static AMBIENTLIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.ambientInfo;
        }
    }

    /**
     * @type {semanticObject}
     */
    static DIRECTIONALLIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    static DIRECTIONALLIGHTSINFO: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.infos;
        }
    }

    /**
     * @type {semanticObject}
     */
    static DIRECTIONALLIGHTSSHADOWMAP: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            const result = lightManager.directionalInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }

    /**
     * @type {semanticObject}
     */
    static DIRECTIONALLIGHTSSHADOWMAPSIZE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.shadowMapSize;
        }
    }

    /**
     * @type {semanticObject}
     */
    static DIRECTIONALLIGHTSSHADOWBIAS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.shadowBias;
        }
    }

    /**
     * @type {semanticObject}
     */
    static DIRECTIONALLIGHTSPACEMATRIX: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.lightSpaceMatrix;
        }
    }

    /**
     * @type {semanticObject}
     */
    static POINTLIGHTSPOS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.poses;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  POINTLIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  POINTLIGHTSINFO: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.infos;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  POINTLIGHTSRANGE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.ranges;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  POINTLIGHTSSHADOWMAP: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            const result = lightManager.pointInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  POINTLIGHTSSHADOWBIAS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.shadowBias;
        }
    }

    /**
     * @type {semanticObject}
     */
    static POINTLIGHTSPACEMATRIX: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.lightSpaceMatrix;
        }
    }

    /**
     * @type {semanticObject}
     */
    static POINTLIGHTCAMERA: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.cameras;
        }
    }

    /**
     * @type {semanticObject}
     */
    static SPOTLIGHTSPOS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.poses;
        }
    }

    /**
     * @type {semanticObject}
     */
    static SPOTLIGHTSDIR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.dirs;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  SPOTLIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    static SPOTLIGHTSCUTOFFS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.cutoffs;
        }
    }

    /**
     * @type {semanticObject}
     */
    static SPOTLIGHTSINFO: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.infos;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  SPOTLIGHTSRANGE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.ranges;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  SPOTLIGHTSSHADOWMAP: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            const result = lightManager.spotInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }

    /**
     * @type {semanticObject}
     */
    static SPOTLIGHTSSHADOWMAPSIZE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.shadowMapSize;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  SPOTLIGHTSSHADOWBIAS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.shadowBias;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  SPOTLIGHTSPACEMATRIX: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.lightSpaceMatrix;
        }
    }

    /**
     * @type {semanticObject}
     */
    static AREALIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.areaInfo.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    static AREALIGHTSPOS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.areaInfo.poses;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  AREALIGHTSWIDTH: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.areaInfo.width;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  AREALIGHTSHEIGHT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.areaInfo.height;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  AREALIGHTSLTCTEXTURE1: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerTexture(lightManager.areaInfo.ltcTexture1, programInfo.textureIndex);
        }
    }

    /**
     * @type {semanticObject}
     */
    static  AREALIGHTSLTCTEXTURE2: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerTexture(lightManager.areaInfo.ltcTexture2, programInfo.textureIndex);
        }
    }

    // fog

    /**
     * @type {semanticObject}
     */
    static  FOGCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (fog) {
                return fog.color.elements;
            }
            return undefined;
        }
    }

    /**
     * @type {semanticObject}
     */
    static  FOGINFO: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (fog) {
                return fog.getInfo();
            }
            return undefined;
        }
    }

    // unQuantize

    /**
     * @type {semanticObject}
     */
    static  POSITIONDECODEMAT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.positionDecodeMat;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static  NORMALDECODEMAT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.normalDecodeMat;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    static   UVDECODEMAT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.uvDecodeMat;
        },
        isDependMesh: true
    }

    static  UV1DECODEMAT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.uv1DecodeMat;
        },
        isDependMesh: true
    }
}


// Texture or Vector4
[
    ['DIFFUSE', 'diffuse'],
    ['SPECULAR', 'specular'],
    ['EMISSION', 'emission'],
    ['AMBIENT', 'ambient']
].forEach((info) => {
    const [
        semanticName,
        textureName,
    ] = info;

    semantic[semanticName] = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerColorOrTexture(material[textureName], programInfo.textureIndex);
        }
    };

    semantic[`${semanticName}UV`] = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerUV(material[textureName]);
        }
    };
});

// Texture
[
    ['NORMALMAP', 'normalMap'],
    ['PARALLAXMAP', 'parallaxMap'],
    ['BASECOLORMAP', 'baseColorMap'],
    ['METALLICMAP', 'metallicMap'],
    ['ROUGHNESSMAP', 'roughnessMap'],
    ['METALLICROUGHNESSMAP', 'metallicRoughnessMap'],
    ['OCCLUSIONMAP', 'occlusionMap'],
    ['SPECULARGLOSSINESSMAP', 'specularGlossinessMap'],
    ['LIGHTMAP', 'lightMap']
].forEach((info) => {
    const [
        semanticName,
        textureName,
    ] = info;

    semantic[semanticName] = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerTexture(material[textureName], programInfo.textureIndex);
        }
    };

    semantic[`${semanticName}UV`] = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerUV(material[textureName]);
        }
    };
});

// TRANSPARENCY
[
    ['TRANSPARENCY', 'transparency']
].forEach((info) => {
    const [
        semanticName,
        textureName,
    ] = info;

    semantic[semanticName] = {
        get(mesh : Mesh, material : Material, programInfo) {
            const value = material[textureName];
            if (value && value.isTexture) {
                return semantic.handlerTexture(value, programInfo.textureIndex);
            }

            if (value !== undefined && value !== null) {
                return value;
            }

            return 1;
        }
    };

    semantic[`${semanticName}UV`] = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerUV(material[textureName]);
        }
    };
});
