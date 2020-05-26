import { Material } from "./Material";
import Texture from "../texture/Texture";
import Color from "../math/Color";
import { Matrix4 } from "../math/Matrix4";
import { RenderOptions } from "../renderer/RenderOptions";


export class BasicMaterial extends Material{

     /**
     * 漫反射贴图，或颜色
     */
    diffuse: Texture | Color = new Color(.5, .5, .5);


    /**
     * 环境光贴图，或颜色
     */
    ambient:Texture | Color = null;

     /**
     * 镜面贴图，或颜色
     */
    specular: Texture | Color = new Color(1, 1, 1);


    /**
     * 放射光贴图，或颜色
     */
    emission: Texture | Color = new Color(0, 0, 0);

    /**
     * 高光发光值
     */
    shininess: number = 32;

    usedUniformVectors: number = 11;

    constructor(){
        super();

        this.lightType = 'BLINN-PHONG';

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

    getClassName() : string{
        return "BasicMaterial";
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
            textureOption.add(this.diffuse, 'DIFFUSE_MAP');
        }

        if (option.HAS_LIGHT) {
            textureOption.add(this.specular, 'SPECULAR_MAP');
            textureOption.add(this.ambient, 'AMBIENT_MAP');
        }

        textureOption.update();

        return option;
    }

}