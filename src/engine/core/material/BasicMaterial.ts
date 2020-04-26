import { Material } from "./Material";
import { Texture } from "../graphics/Texture";
import { Color } from "../graphics/Color";
import { CubeTexture } from "../graphics/CubeTexture";
import { Matrix4 } from "../math/Matrix4";
import { RenderOptions } from "../renderering/RenderOptions";

export class BasicMaterial extends Material{

     /**
     * 光照类型，支持: NONE, PHONG, BLINN-PHONG, LAMBERT
     * @default BLINN-PHONG
     * @type {string}
     */
    lightType: string = 'BLINN-PHONG';


     /**
     * 漫反射贴图，或颜色
     * @default Color(.5, .5, .5)
     * @type {Texture|Color}
     */
    diffuse: Texture | Color = null;


    /**
     * 环境光贴图，或颜色
     * @default null
     * @type {Texture|Color}
     */
    ambient:Texture|Color = null;

     /**
     * 镜面贴图，或颜色
     * @default Color(1, 1, 1)
     * @type {Texture|Color}
     */
    specular: Texture|Color = null;


    /**
     * 放射光贴图，或颜色
     * @default Color(0, 0, 0)
     * @type {Texture|Color}
     */
    emission: Texture|Color = null;


    /**
     * 环境贴图
     * @default null
     * @type {CubeTexture|Texture}
     */
    specularEnvMap: CubeTexture|Texture = null;



    /**
     * 环境贴图变化矩阵，如旋转等
     * @default null
     * @type {Matrix4}
     */
    specularEnvMatrix: Matrix4 = null;


    /**
     * 反射率
     * @default 0
     * @type {number}
     */
    reflectivity: number = 0;


    /**
     * 折射比率
     * @default 0
     * @type {number}
     */
    refractRatio: number = 0;


     /**
     * 折射率
     * @default 0
     * @type {number}
     */
    refractivity: number = 0;

    /**
     * 高光发光值
     * @default 32
     * @type {number}
     */
    shininess: number = 32;

    usedUniformVectors: number = 11;

    constructor(){
        super();

        this.diffuse = new Color(.5, .5, .5);
        this.specular = new Color(1, 1, 1);
        this.emission = new Color(0, 0, 0);

        Object.assign(this.uniforms, {
            u_diffuse: 'DIFFUSE',
            u_specular: 'SPECULAR',
            u_ambient: 'AMBIENT',
            u_shininess: 'SHININESS',
            u_reflectivity: 'REFLECTIVITY',
            u_refractRatio: 'REFRACTRATIO',
            u_refractivity: 'REFRACTIVITY',
            u_specularEnvMap: 'SPECULARENVMAP',
            u_specularEnvMatrix: 'SPECULARENVMATRIX'
        });

        this.addTextureUniforms({
            u_diffuse: 'DIFFUSE',
            u_specular: 'SPECULAR',
            u_ambient: 'AMBIENT'
        });
    }


    getRenderOption(option: RenderOptions = {}) {
        super.getRenderOption(option);

        const textureOption = this._textureOption.reset(option);

        const lightType = this.lightType;
        if (lightType === 'PHONG' || lightType === 'BLINN-PHONG') {
            option.HAS_SPECULAR = 1;
        }


        const diffuse = this.diffuse;
        if (diffuse && (diffuse instanceof Texture)) {
            if (diffuse instanceof CubeTexture) {
                option.DIFFUSE_CUBE_MAP = 1;
            } else {
                textureOption.add(this.diffuse, 'DIFFUSE_MAP');
            }
        }

        if (option.HAS_LIGHT) {
            textureOption.add(this.specular, 'SPECULAR_MAP');
            textureOption.add(this.ambient, 'AMBIENT_MAP');
            textureOption.add(this.specularEnvMap, 'SPECULAR_ENV_MAP');
        }

        textureOption.update();

        return option;
    }

}