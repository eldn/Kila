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


/**
 * 语义
 * @namespace semantic
 * @type {Object}
 */
export class semantic{

    public static state: WebGLState = null;

    public static  camera:  Camera = null;


    public static  lightManager: LightManager = null;

 
    public static  gl: WebGLRenderingContext = null;
 

    private static _renderer: WebGLRenderer = null;

    /**
     * 初始化
     * @param  _state
     * @param  _camera
     * @param  _lightManager
     * @param  _fog
     */
    public static init(_renderer : WebGLRenderer, _state : WebGLState, _camera : Camera, _lightManager : LightManager) : void{
        renderer = this._renderer = _renderer;
        state = this.state = _state;
        camera = this.camera = _camera;
        lightManager = this.lightManager = _lightManager;
        gl = this.gl = state.gl;
    }

    /**
     * 设置相机
     * @param  _camera
     */
    public static setCamera(_camera : Camera) : void {
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

    public static handlerTexture(value : Texture, textureIndex) : number {
        if (value && value instanceof Texture) {
            return this.handlerGLTexture(value.target, value.getGLTexture(state), textureIndex);
        }

        return undefined;
    }

    public static handlerGLTexture(target : number, texture : WebGLTexture, textureIndex) : number{
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

    static POSITION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.vertices;
        }
    }

    static NORMAL: Object =  {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.normals;
        }
    }

  
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

    static TEXCOORD_0: Object =  {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!mesh.geometry.uvs) {
                return undefined;
            }
            return mesh.geometry.uvs;
        }
    }

   
    static TEXCOORD_1: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!mesh.geometry.uvs1) {
                return undefined;
            }
            return mesh.geometry.uvs1;
        }
    }


    static UVMATRIX_0: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!material.uvMatrix) {
                return undefined;
            }
            return material.uvMatrix.elements;
        }
    }

  
    static UVMATRIX_1: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!material.uvMatrix1) {
                return undefined;
            }
            return material.uvMatrix1.elements;
        }
    }

   
    static CAMERAFAR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (camera instanceof PerspectiveCamera) {
                return camera.far;
            }
            return undefined;
        }
    }

   
    static CAMERANEAR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (camera  instanceof PerspectiveCamera) {
                return camera.near;
            }
            return undefined;
        }
    }

  
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



    static COLOR_0: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (!mesh.geometry.colors) {
                return undefined;
            }
            return mesh.geometry.colors;
        }
    }

    // uniforms

    static RENDERERSIZE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            tempFloat32Array2[0] = renderer.width;
            tempFloat32Array2[1] = renderer.height;
            return tempFloat32Array2;
        }
    }

 
    static LOCAL: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.matrix.elements;
        },
        isDependMesh: true
    }

  
    static MODEL: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.worldMatrix.elements;
        },
        isDependMesh: true
    }

 
    static VIEW: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.viewMatrix.elements;
        }
    }

    static PROJECTION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.projectionMatrix.elements;
        }
    }

  
    static VIEWPROJECTION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.viewProjectionMatrix.elements;
        }
    }

 
    static MODELVIEW: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.getModelViewMatrix(mesh, tempMatrix4).elements;
        },
        isDependMesh: true
    }

 
    static MODELVIEWPROJECTION: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.getModelProjectionMatrix(mesh, tempMatrix4).elements;
        },
        isDependMesh: true
    }

  
    static MODELINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix4.invert(mesh.worldMatrix).elements;
        },
        isDependMesh: true
    }

 
    static VIEWINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return camera.worldMatrix.elements;
        }
    }


   static VIEWINVERSEINVERSETRANSPOSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix3.normalFromMat4(camera.worldMatrix).elements;
        }
    }


    static PROJECTIONINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix4.invert(camera.projectionMatrix).elements;
        }
    }

 
    static MODELVIEWINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix4.invert(camera.getModelViewMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }

 
    static MODELVIEWPROJECTIONINVERSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix4.invert(camera.getModelProjectionMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }


    static MODELINVERSETRANSPOSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix3.normalFromMat4(mesh.worldMatrix).elements;
        },
        isDependMesh: true
    }

 
    static MODELVIEWINVERSETRANSPOSE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return tempMatrix3.normalFromMat4(camera.getModelViewMatrix(mesh, tempMatrix4)).elements;
        },
        isDependMesh: true
    }


    static NORMALMAPSCALE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return material.normalMapScale;
        }
    }


    static SHININESS: Object = {
        get(mesh, material, programInfo) {
            return material.shininess;
        }
    }


    // light

    static AMBIENTLIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.ambientInfo;
        }
    }

 
    static DIRECTIONALLIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.colors;
        }
    }

  
    static DIRECTIONALLIGHTSINFO: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.infos;
        }
    }

 
    static DIRECTIONALLIGHTSSHADOWMAP: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            const result = lightManager.directionalInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }


    static DIRECTIONALLIGHTSSHADOWMAPSIZE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.shadowMapSize;
        }
    }

   
    static DIRECTIONALLIGHTSSHADOWBIAS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.shadowBias;
        }
    }

    static DIRECTIONALLIGHTSPACEMATRIX: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.directionalInfo.lightSpaceMatrix;
        }
    }


    static POINTLIGHTSPOS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.poses;
        }
    }

 
    static  POINTLIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.colors;
        }
    }

 
    static  POINTLIGHTSINFO: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.infos;
        }
    }

  
    static  POINTLIGHTSRANGE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.ranges;
        }
    }

 
    static  POINTLIGHTSSHADOWMAP: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            const result = lightManager.pointInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }


    static  POINTLIGHTSSHADOWBIAS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.shadowBias;
        }
    }


    static POINTLIGHTSPACEMATRIX: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.lightSpaceMatrix;
        }
    }


    static POINTLIGHTCAMERA: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.pointInfo.cameras;
        }
    }

 
    static SPOTLIGHTSPOS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.poses;
        }
    }

  
    static SPOTLIGHTSDIR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.dirs;
        }
    }

  
    static  SPOTLIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.colors;
        }
    }

 
    static SPOTLIGHTSCUTOFFS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.cutoffs;
        }
    }


    static SPOTLIGHTSINFO: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.infos;
        }
    }


    static  SPOTLIGHTSRANGE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.ranges;
        }
    }


    static  SPOTLIGHTSSHADOWMAP: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            const result = lightManager.spotInfo.shadowMap.map((texture, i) => {
                return semantic.handlerTexture(texture, programInfo.textureIndex + i);
            });
            return result;
        }
    }

  
    static SPOTLIGHTSSHADOWMAPSIZE: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.shadowMapSize;
        }
    }

  
    static  SPOTLIGHTSSHADOWBIAS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.shadowBias;
        }
    }

 
    static  SPOTLIGHTSPACEMATRIX: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.spotInfo.lightSpaceMatrix;
        }
    }

 
    static AREALIGHTSCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.areaInfo.colors;
        }
    }

 
    static AREALIGHTSPOS: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.areaInfo.poses;
        }
    }


    static  AREALIGHTSWIDTH: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.areaInfo.width;
        }
    }

 
    static  AREALIGHTSHEIGHT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return lightManager.areaInfo.height;
        }
    }

  
    static  AREALIGHTSLTCTEXTURE1: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerTexture(lightManager.areaInfo.ltcTexture1, programInfo.textureIndex);
        }
    }


    static  AREALIGHTSLTCTEXTURE2: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return semantic.handlerTexture(lightManager.areaInfo.ltcTexture2, programInfo.textureIndex);
        }
    }

    // fog

 
    static  FOGCOLOR: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (fog) {
                return fog.color.elements;
            }
            return undefined;
        }
    }

 
    static  FOGINFO: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            if (fog) {
                return fog.getInfo();
            }
            return undefined;
        }
    }

    // unQuantize

   
    static  POSITIONDECODEMAT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.positionDecodeMat;
        },
        isDependMesh: true
    }

  
    static  NORMALDECODEMAT: Object = {
        get(mesh : Mesh, material : Material, programInfo) {
            return mesh.geometry.normalDecodeMat;
        },
        isDependMesh: true
    }

 
    static UVDECODEMAT: Object = {
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
