/* eslint no-unused-vars: "off" */

import { Vector3 } from "../math/Vector3";
import { Matrix3x3 } from "../math/Matrix3x3";
import { Matrix4x4 } from "../math/Matrix4x4";
import { WebGLState } from "./WebGlState";
import { Camera } from "../world/cameras/Camera";
import { LightManager } from "./LightManager";
import { Fog } from "./Fog";
import { log } from "../utils/Log";


const tempVector3 = new Vector3();
const tempMatrix3 = new Matrix3x3();
const tempMatrix4 = new Matrix4x4();
const tempFloat32Array4 = new Float32Array([0.5, 0.5, 0.5, 1]);
const tempFloat32Array2 = new Float32Array([0, 0]);
const blankInfo = {
    get() {
        return undefined;
    }
};

let camera;
let gl;
let lightManager;
let state;
let fog;
let renderer;

/**
 * 语义
 * @namespace semantic
 * @type {Object}
 */
export class semantic{
    /**
     * @type {State}
     */
    state: WebGLState = null;

    /**
     * @type {Camera}
     */
    camera:  Camera = null;

    /**
     * @type {LightManager}
     */
    lightManager: LightManager = null;

    /**
     * @type {Fog}
     */
    fog: Fog = null;

    /**
     * @type {WebGLRenderingContext}
     */
    gl: WebGLRenderingContext = null;
    /**
     * WebGLRenderer
     * @type {WebGLRenderer}
     */
    _renderer: null;

    blankInfo;

    /**
     * 初始化
     * @param  {State} _state
     * @param  {Camera} _camera
     * @param  {LightManager} _lightManager
     * @param  {Fog} _fog
     */
    init(_renderer, _state, _camera, _lightManager, _fog) {
        renderer = this._renderer = _renderer;
        state = this.state = _state;
        camera = this.camera = _camera;
        lightManager = this.lightManager = _lightManager;
        fog = this.fog = _fog;
        gl = this.gl = state.gl;
    }

    /**
     * 设置相机
     * @param {Camera} _camera
     */
    setCamera(_camera) {
        camera = this.camera = _camera;
    }

    handlerColorOrTexture(value, textureIndex) {
        if (value && value.isTexture) {
            return this.handlerTexture(value, textureIndex);
        }

        if (value && value.isColor) {
            value.toArray(tempFloat32Array4);
        } else {
            tempFloat32Array4[0] = tempFloat32Array4[1] = tempFloat32Array4[2] = 0.5;
        }

        return tempFloat32Array4;
    }

    handlerTexture(value, textureIndex) {
        if (value && value.isTexture) {
            return this.handlerGLTexture(value.target, value.getGLTexture(state), textureIndex);
        }

        return undefined;
    }

    handlerGLTexture(target, texture, textureIndex) {
        if (texture) {
            state.activeTexture(gl.TEXTURE0 + textureIndex);
            state.bindTexture(target, texture);
            return textureIndex;
        }

        return undefined;
    }

    handlerUV(texture) {
        if (texture && texture.isTexture) {
            return texture.uv || 0;
        }

        return 0;
    }

    // attributes

    /**
     * @type {semanticObject}
     */
    POSITION: Object = {
        get(mesh, material, programInfo) {
            return mesh.geometry.vertices;
        }
    }

    /**
     * @type {semanticObject}
     */
    NORMAL: Object =  {
        get(mesh, material, programInfo) {
            return mesh.geometry.normals;
        }
    }

    /**
     * @type {semanticObject}
     */
    TANGENT: Object = {
        get(mesh, material, programInfo) {
            const normalMap = material.normalMap;
            if (normalMap && normalMap.isTexture) {
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
    TEXCOORD_0: Object =  {
        get(mesh, material, programInfo) {
            if (!mesh.geometry.uvs) {
                return undefined;
            }
            return mesh.geometry.uvs;
        }
    }

    /**
     * @type {semanticObject}
     */
    TEXCOORD_1: Object = {
        get(mesh, material, programInfo) {
            if (!mesh.geometry.uvs1) {
                return undefined;
            }
            return mesh.geometry.uvs1;
        }
    }

    /**
     * @type {semanticObject}
     */
    UVMATRIX_0: Object = {
        get(mesh, material, programInfo) {
            if (!material.uvMatrix) {
                return undefined;
            }
            return material.uvMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    UVMATRIX_1: Object = {
        get(mesh, material, programInfo) {
            if (!material.uvMatrix1) {
                return undefined;
            }
            return material.uvMatrix1.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    CAMERAFAR: Object = {
        get(mesh, material, programInfo) {
            if (camera.isPerspectiveCamera) {
                return camera.far;
            }
            return undefined;
        }
    }

    /**
     * @type {semanticObject}
     */
    CAMERANEAR: Object = {
        get(mesh, material, programInfo) {
            if (camera.isPerspectiveCamera) {
                return camera.near;
            }
            return undefined;
        }
    }

    /**
     * @type {semanticObject}
     */
    CAMERATYPE: Object = {
        get(mesh, material, programInfo) {
            if (camera.isPerspectiveCamera) {
                return 1;
            }
            return 0;
        }
    }

    CAMERAPOSITION: Object = {
        get(mesh, material, programInfo) {
            return camera.worldMatrix.getTranslation(tempVector3).elements;
        }
    }


    /**
     * @type {semanticObject}
     */
    COLOR_0: Object = {
        get(mesh, material, programInfo) {
            if (!mesh.geometry.colors) {
                return undefined;
            }
            return mesh.geometry.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    SKININDICES: Object = {
        get(mesh, material, programInfo) {
            return mesh.geometry.skinIndices;
        }
    }

    /**
     * @type {semanticObject}
     */
    SKINWEIGHTS: Object = {
        get(mesh, material, programInfo) {
            return mesh.geometry.skinWeights;
        }
    }

    // uniforms

    /**
     * @type {semanticObject}
     */
    RENDERERSIZE: Object = {
        get(mesh, material, programInfo) {
            tempFloat32Array2[0] = renderer.width;
            tempFloat32Array2[1] = renderer.height;
            return tempFloat32Array2;
        }
    }

    /**
     * @type {semanticObject}
     */
    LOCAL: Object = {
        get(mesh, material, programInfo) {
            return mesh.matrix.elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    MODEL: Object = {
        get(mesh, material, programInfo) {
            return mesh.worldMatrix.elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    VIEW: Object = {
        get(mesh, material, programInfo) {
            return camera.viewMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    PROJECTION: Object = {
        get(mesh, material, programInfo) {
            return camera.projectionMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    VIEWPROJECTION: Object = {
        get(mesh, material, programInfo) {
            return camera.viewProjectionMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    MODELVIEW: Object = {
        get(mesh, material, programInfo) {
            return camera.getModelViewMatrix(mesh, tempMatrix4).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    MODELVIEWPROJECTION: Object = {
        get(mesh, material, programInfo) {
            return camera.getModelProjectionMatrix(mesh, tempMatrix4).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    MODELINVERSE: Object = {
        get(mesh, material, programInfo) {
            return tempMatrix4.invert(mesh.worldMatrix).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    VIEWINVERSE: Object = {
        get(mesh, material, programInfo) {
            return camera.worldMatrix.elements;
        }
    }

    /**
     * @type {semanticObject}
    */
    VIEWINVERSEINVERSETRANSPOSE: Object = {
        get(mesh, material, programInfo) {
            return tempMatrix3.normalFromMat4(camera.worldMatrix).elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    PROJECTIONINVERSE: Object = {
        get(mesh, material, programInfo) {
            return tempMatrix4.invert(camera.projectionMatrix).elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    MODELVIEWINVERSE: Object = {
        get(mesh, material, programInfo) {
            return tempMatrix4.invert(camera.getModelViewMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    MODELVIEWPROJECTIONINVERSE: Object = {
        get(mesh, material, programInfo) {
            return tempMatrix4.invert(camera.getModelProjectionMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    MODELINVERSETRANSPOSE: Object = {
        get(mesh, material, programInfo) {
            return tempMatrix3.normalFromMat4(mesh.worldMatrix).elements;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    MODELVIEWINVERSETRANSPOSE: Object = {
        get(mesh, material, programInfo) {
            return tempMatrix3.normalFromMat4(camera.getModelViewMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }

    /**
     * 还未实现，不要使用
     * @type {semanticObject}
     * @default undefined
     */
    VIEWPORT: undefined;

    /**
     * @type {semanticObject}
     */
    JOINTMATRIX: Object = {
        get(mesh, material, programInfo) {
            if (mesh.isSkinedMesh) {
                return mesh.getJointMat();
            }
            log.warnOnce(`semantic.JOINTMATRIX(${mesh.id})`, 'Current mesh is not SkinedMesh!', mesh.id);
            return undefined;
        },
        isDependMesh: true,
        notSupportInstanced: true
    }

    /**
     * @type {semanticObject}
     */
    JOINTMATRIXTEXTURE: Object = {
        get(mesh, material, programInfo) {
            if (mesh.isSkinedMesh) {
                mesh.updateJointMatTexture();
                return semantic.handlerTexture(mesh.jointMatTexture, programInfo.textureIndex);
            }
            log.warnOnce(`semantic.JOINTMATRIXTEXTURE(${mesh.id})`, 'Current mesh is not SkinedMesh!', mesh.id);
            return undefined;
        },
        isDependMesh: true,
        notSupportInstanced: true
    }

    /**
     * @type {semanticObject}
     */
    JOINTMATRIXTEXTURESIZE: Object = {
        get(mesh, material, programInfo) {
            if (mesh.isSkinedMesh) {
                mesh.initJointMatTexture();
                return [mesh.jointMatTexture.width, mesh.jointMatTexture.height];
            }
            log.warnOnce(`semantic.JOINTMATRIXTEXTURESIZE(${mesh.id})`, 'Current mesh is not SkinedMesh!', mesh.id);
            return undefined;
        },
        isDependMesh: true,
        notSupportInstanced: true
    }

    /**
     * @type {semanticObject}
     */
    NORMALMAPSCALE: Object = {
        get(mesh, material, programInfo) {
            return material.normalMapScale;
        }
    }

    /**
     * @type {semanticObject}
     */
    OCCLUSIONSTRENGTH: Object = {
        get(mesh, material, programInfo) {
            return material.occlusionStrength;
        }
    }


    /**
     * @type {semanticObject}
     */
    SHININESS: Object = {
        get(mesh, material, programInfo) {
            return material.shininess;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPECULARENVMATRIX: Object = {
        get(mesh, material, programInfo) {
            if (material.specularEnvMatrix && material.specularEnvMap) {
                return material.specularEnvMatrix.elements;
            }
            tempMatrix4.identity();
            return tempMatrix4.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    REFLECTIVITY: Object = {
        get(mesh, material, programInfo) {
            return material.reflectivity;
        }
    }

    /**
     * @type {semanticObject}
     */
    REFRACTRATIO: Object = {
        get(mesh, material, programInfo) {
            return material.refractRatio;
        }
    }

    /**
     * @type {semanticObject}
     */
    REFRACTIVITY: Object = {
        get(mesh, material, programInfo) {
            return material.refractivity;
        }
    }

    LOGDEPTH: Object = {
        get(mesh, material, programInfo) {
            return 2.0 / (Math.log(camera.far + 1.0) / Math.LN2);
        }
    }

    // light

    /**
     * @type {semanticObject}
     */
    AMBIENTLIGHTSCOLOR: Object = {
        get(mesh, material, programInfo) {
            return lightManager.ambientInfo;
        }
    }

    /**
     * @type {semanticObject}
     */
    DIRECTIONALLIGHTSCOLOR: Object = {
        get(mesh, material, programInfo) {
            return lightManager.directionalInfo.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    DIRECTIONALLIGHTSINFO: Object = {
        get(mesh, material, programInfo) {
            return lightManager.directionalInfo.infos;
        }
    }

    /**
     * @type {semanticObject}
     */
    DIRECTIONALLIGHTSSHADOWMAP: Object = {
        get(mesh, material, programInfo) {
            const result = lightManager.directionalInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }

    /**
     * @type {semanticObject}
     */
    DIRECTIONALLIGHTSSHADOWMAPSIZE: Object = {
        get(mesh, material, programInfo) {
            return lightManager.directionalInfo.shadowMapSize;
        }
    }

    /**
     * @type {semanticObject}
     */
    DIRECTIONALLIGHTSSHADOWBIAS: Object = {
        get(mesh, material, programInfo) {
            return lightManager.directionalInfo.shadowBias;
        }
    }

    /**
     * @type {semanticObject}
     */
    DIRECTIONALLIGHTSPACEMATRIX: Object = {
        get(mesh, material, programInfo) {
            return lightManager.directionalInfo.lightSpaceMatrix;
        }
    }

    /**
     * @type {semanticObject}
     */
    POINTLIGHTSPOS: Object = {
        get(mesh, material, programInfo) {
            return lightManager.pointInfo.poses;
        }
    }

    /**
     * @type {semanticObject}
     */
    POINTLIGHTSCOLOR: Object = {
        get(mesh, material, programInfo) {
            return lightManager.pointInfo.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    POINTLIGHTSINFO: Object = {
        get(mesh, material, programInfo) {
            return lightManager.pointInfo.infos;
        }
    }

    /**
     * @type {semanticObject}
     */
    POINTLIGHTSRANGE: Object = {
        get(mesh, material, programInfo) {
            return lightManager.pointInfo.ranges;
        }
    }

    /**
     * @type {semanticObject}
     */
    POINTLIGHTSSHADOWMAP: Object = {
        get(mesh, material, programInfo) {
            const result = lightManager.pointInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }

    /**
     * @type {semanticObject}
     */
    POINTLIGHTSSHADOWBIAS: Object = {
        get(mesh, material, programInfo) {
            return lightManager.pointInfo.shadowBias;
        }
    }

    /**
     * @type {semanticObject}
     */
    POINTLIGHTSPACEMATRIX: Object = {
        get(mesh, material, programInfo) {
            return lightManager.pointInfo.lightSpaceMatrix;
        }
    }

    /**
     * @type {semanticObject}
     */
    POINTLIGHTCAMERA: Object = {
        get(mesh, material, programInfo) {
            return lightManager.pointInfo.cameras;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSPOS: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.poses;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSDIR: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.dirs;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSCOLOR: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSCUTOFFS: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.cutoffs;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSINFO: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.infos;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSRANGE: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.ranges;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSSHADOWMAP: Object = {
        get(mesh, material, programInfo) {
            const result = lightManager.spotInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSSHADOWMAPSIZE: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.shadowMapSize;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSSHADOWBIAS: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.shadowBias;
        }
    }

    /**
     * @type {semanticObject}
     */
    SPOTLIGHTSPACEMATRIX: Object = {
        get(mesh, material, programInfo) {
            return lightManager.spotInfo.lightSpaceMatrix;
        }
    }

    /**
     * @type {semanticObject}
     */
    AREALIGHTSCOLOR: Object = {
        get(mesh, material, programInfo) {
            return lightManager.areaInfo.colors;
        }
    }

    /**
     * @type {semanticObject}
     */
    AREALIGHTSPOS: Object = {
        get(mesh, material, programInfo) {
            return lightManager.areaInfo.poses;
        }
    }

    /**
     * @type {semanticObject}
     */
    AREALIGHTSWIDTH: Object = {
        get(mesh, material, programInfo) {
            return lightManager.areaInfo.width;
        }
    }

    /**
     * @type {semanticObject}
     */
    AREALIGHTSHEIGHT: Object = {
        get(mesh, material, programInfo) {
            return lightManager.areaInfo.height;
        }
    }

    /**
     * @type {semanticObject}
     */
    AREALIGHTSLTCTEXTURE1: Object = {
        get(mesh, material, programInfo) {
            return semantic.handlerTexture(lightManager.areaInfo.ltcTexture1, programInfo.textureIndex);
        }
    }

    /**
     * @type {semanticObject}
     */
    AREALIGHTSLTCTEXTURE2: Object = {
        get(mesh, material, programInfo) {
            return semantic.handlerTexture(lightManager.areaInfo.ltcTexture2, programInfo.textureIndex);
        }
    }

    // fog

    /**
     * @type {semanticObject}
     */
    FOGCOLOR: Object = {
        get(mesh, material, programInfo) {
            if (fog) {
                return fog.color.elements;
            }
            return undefined;
        }
    }

    /**
     * @type {semanticObject}
     */
    FOGINFO: Object = {
        get(mesh, material, programInfo) {
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
    POSITIONDECODEMAT: Object = {
        get(mesh, material, programInfo) {
            return mesh.geometry.positionDecodeMat;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    NORMALDECODEMAT: Object = {
        get(mesh, material, programInfo) {
            return mesh.geometry.normalDecodeMat;
        },
        isDependMesh: true
    }

    /**
     * @type {semanticObject}
     */
    UVDECODEMAT: Object = {
        get(mesh, material, programInfo) {
            return mesh.geometry.uvDecodeMat;
        },
        isDependMesh: true
    }
    UV1DECODEMAT: Object = {
        get(mesh, material, programInfo) {
            return mesh.geometry.uv1DecodeMat;
        },
        isDependMesh: true
    }

    // pbr

    /**
     * @type {semanticObject}
     */
    BASECOLOR: Object = {
        get(mesh, material, programInfo) {
            return material.baseColor.elements;
        }
    }

    /**
     * @type {semanticObject}
     */
    METALLIC: Object = {
        get(mesh, material, programInfo) {
            return material.metallic;
        }
    }

    /**
     * @type {semanticObject}
     */
    ROUGHNESS: Object = {
        get(mesh, material, programInfo) {
            return material.roughness;
        }
    }


    /**
     * @type {semanticObject}
     */
    DIFFUSEENVMAP: Object = {
        get(mesh, material, programInfo) {
            return semantic.handlerTexture(material.diffuseEnvMap, programInfo.textureIndex);
        }
    }
    /**
     * @type {semanticObject}
     */
    DIFFUSEENVINTENSITY: Object = {
        get(mesh, material, programInfo) {
            return material.diffuseEnvIntensity;
        }
    }

    DIFFUSEENVSPHEREHARMONICS3: Object = {
        get(mesh, material, programInfo) {
            const sphereHarmonics3 = material.diffuseEnvSphereHarmonics3;
            if (sphereHarmonics3) {
                return sphereHarmonics3.toArray();
            }
            return undefined;
        }
    }

    /**
     * @type {semanticObject}
     */
    BRDFLUT: Object = {
        get(mesh, material, programInfo) {
            return semantic.handlerTexture(material.brdfLUT, programInfo.textureIndex);
        }
    }

    /**
     * @type {semanticObject}
     */
    SPECULARENVMAP: Object = {
        get(mesh, material, programInfo) {
            return semantic.handlerTexture(material.specularEnvMap, programInfo.textureIndex);
        }
    }
    SPECULARENVINTENSITY: Object = {
        get(mesh, material, programInfo) {
            return material.specularEnvIntensity;
        }
    }
    SPECULARENVMAPMIPCOUNT: Object = {
        get(mesh, material, programInfo) {
            const specularEnvMap = material.specularEnvMap;
            if (specularEnvMap) {
                return specularEnvMap.mipmapCount;
            }
            return 1;
        }
    }
    GLOSSINESS: Object = {
        get(mesh, material, programInfo) {
            return material.glossiness;
        }
    }
    ALPHACUTOFF: Object = {
        get(mesh, material, programInfo) {
            return material.alphaCutoff;
        }
    }
    EXPOSURE: Object = {
        get(mesh, material, programInfo) {
            return material.exposure;
        }
    }
    GAMMAFACTOR: Object = {
        get(mesh, material, programInfo) {
            return material.gammaFactor;
        }
    }

    // Morph Animation Uniforms
    MORPHWEIGHTS: Object = {
        isDependMesh: true,
        notSupportInstanced: true,
        get(mesh, material, programInfo) {
            const geometry = mesh.geometry;
            if (!geometry.isMorphGeometry || !geometry.weights) {
                return undefined;
            }
            return geometry.weights;
        }
    }
};


// Morph Animation Attributes
[
    ['POSITION', 'vertices'],
    ['NORMAL', 'normals'],
    ['TANGENT', 'tangents']
].forEach((info) => {
    for (let i = 0; i < 8; i++) {
        semantic['MORPH' + info[0] + i] = {
            get: (function(name, i) {
                return function(mesh, material, programInfo) {
                    const geometry = mesh.geometry;
                    if (!geometry.isMorphGeometry || !geometry.targets || !geometry.targets[name]) {
                        return undefined;
                    }
                    let idx = geometry._originalMorphIndices ? geometry._originalMorphIndices[i] : i;
                    const data = geometry.targets[name][idx];
                    const idxCacheKey = `_target_${name}_${i}`;
                    if (geometry[idxCacheKey] !== idx && data) {
                        data.isDirty = true;
                        geometry[idxCacheKey] = idx;
                    }
                    return data;
                };
            }(info[1], i))
        };
    }
});


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
        get(mesh, material, programInfo) {
            return semantic.handlerColorOrTexture(material[textureName], programInfo.textureIndex);
        }
    };

    semantic[`${semanticName}UV`] = {
        get(mesh, material, programInfo) {
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
        get(mesh, material, programInfo) {
            return semantic.handlerTexture(material[textureName], programInfo.textureIndex);
        }
    };

    semantic[`${semanticName}UV`] = {
        get(mesh, material, programInfo) {
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
        get(mesh, material, programInfo) {
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
        get(mesh, material, programInfo) {
            return semantic.handlerUV(material[textureName]);
        }
    };
});
