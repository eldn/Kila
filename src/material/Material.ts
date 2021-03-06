import { glConstants } from "../constants/glConstants";
import math from "../math/math";
import Texture from "../texture/Texture";
import { TextureOptions } from "../renderer/TextureOptions";
import { RenderOptions } from "../renderer/RenderOptions";
import { Mesh } from "../core/Mesh";
import { log } from "../utils/Log";
import { semantic } from "../renderer/Semantic";
import { Color, Matrix3 } from "../math";



const blankInfo = {
	isBlankInfo: true,
	get() {
		return undefined;
	}
};

const {
	LEQUAL,
	BACK,
	FRONT,
	FRONT_AND_BACK,
	ZERO,
	FUNC_ADD,
	ONE,
	SRC_ALPHA,
	ONE_MINUS_SRC_ALPHA
} = glConstants;


export abstract class Material {

	public _shaderNumId : number;

	/**
	 * 光照类型 NONE, PHONG, BLINN-PHONG, LAMBERT光照模型
	 */
	private _lightType: TypedLight = 'NONE';

	public get lightType(): TypedLight {
		return this._lightType;
	}

	public set lightType(value: TypedLight) {
		this._lightType = value;
	}

	public getClassName() : string{
        return "Material";
    }

	/**
	 * 
	 * 深度测试
	 */
	private _depthTest: boolean = true;

	public get depthTest(): boolean {
		return this._depthTest;
	}

	public set depthTest(value: boolean) {
		this._depthTest = value;
	}

	/**
	 * 深度测试mask
	 */
	private _depthMask: boolean = true;

	public get depthMask(): boolean {
		return this._depthMask;
	}

	public set depthMask(value: boolean) {
		this._depthMask = value;
	}

	private _depthRange: Array<number> = [0, 1];

	public get depthRange(): Array<number> {
		return this._depthRange;
	}

	public set depthRange(value: Array<number>) {
		this._depthRange = value;
	}

	private _depthFunc: number = LEQUAL;

	public get depthFunc(): number {
		return this._depthFunc;
	}

	public set depthFunc(value: number) {
		this._depthFunc = value;
	}

	 /**
     * uv transform eg:new Matrix3().fromRotationTranslationScale(Math.PI/2, 0, 0, 2, 2)
     */
    public uvMatrix: Matrix3 = null;

    /**
     * uv1 transform eg:new Matrix3().fromRotationTranslationScale(Math.PI/2, 0, 0, 2, 2)
     */
    public uvMatrix1: Matrix3 = null;

	private _cullFace: boolean = true;

	public get cullFace(): boolean {
		return this._cullFace;
	}

	public set cullFace(value: boolean) {
		this._cullFace = value;
		if (value) {
			this.cullFaceType = this._cullFaceType;
		} else {
			this._side = FRONT_AND_BACK;
		}
	}

	private _cullFaceType: number = BACK;

	public get cullFaceType(): number {
		return this._cullFaceType;
	}

	public set cullFaceType(value: number) {
		this._cullFaceType = value;
		if (this._cullFace) {
			if (value === BACK) {
				this._side = FRONT;
			} else if (value === FRONT) {
				this._side = BACK;
			}
		}
	}

	private _side: number = FRONT;

	public get side(): number {
		return this._side;
	}

	public set side(value: number) {
		if (this._side !== value) {
			this._side = value;
			if (value === FRONT_AND_BACK) {
				this._cullFace = false;
			} else {
				this._cullFace = true;
				if (value === FRONT) {
					this._cullFaceType = BACK;
				} else if (value === BACK) {
					this._cullFaceType = FRONT;
				}
			}
		}
	}

	private _blend: boolean = false;

	public get blend(): boolean {
		return this._blend;
	}

	public set blend(value: boolean) {
		this._blend = value;
	}

	private _blendEquation: number = FUNC_ADD;

	public get blendEquation(): number {
		return this._blendEquation;
	}

	public set blendEquation(value: number) {
		this._blendEquation = value;
	}

	private _blendEquationAlpha: number = FUNC_ADD;

	public get blendEquationAlpha(): number {
		return this._blendEquationAlpha;
	}

	public set blendEquationAlpha(value: number) {
		this._blendEquationAlpha = value;
	}

	private _blendSrc: number = ONE;

	public get blendSrc(): number {
		return this._blendSrc;
	}

	public set blendSrc(value: number) {
		this._blendSrc = value;
	}

	private _blendDst: number = ZERO;

	public get blendDst(): number {
		return this._blendDst;
	}

	public set blendDst(value: number) {
		this._blendDst = value;
	}

	private _blendSrcAlpha: number = ONE;

	public get blendSrcAlpha(): number {
		return this._blendSrcAlpha;
	}

	public set blendSrcAlpha(value: number) {
		this._blendSrcAlpha = value;
	}

	private _blendDstAlpha: number = ZERO;

	public get blendDstAlpha(): number {
		return this._blendDstAlpha;
	}

	public set blendDstAlpha(value: number) {
		this._blendDstAlpha = value;
	}

	/**
	 * 当前是否需要强制更新
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _isDirty: boolean = false;

	public get isDirty(): boolean {
		return this._isDirty;
	}

	public set isDirty(value: boolean) {
		this._isDirty = value;
	}

	/**
	 *透明度 0~1
	 */
	private _transparency: number = 1;

	public get transparency(): number {
		return this._transparency;
	}

	public set transparency(value: number) {
		this._transparency = value;
	}

	/**
	 *是否需要透明
	 */
	private _transparent: boolean = false;

	public get transparent(): boolean {
		return this._transparent;
	}

	public set transparent(value: boolean) {
		if (this._transparent !== value) {
			this._transparent = value;
			if (!value) {
				this.blend = false;
				this.depthMask = true;
			} else {
				this.setDefaultTransparentBlend();
			}
		}
	}
	

	private _diffuse: Texture | Color;

	public get diffuse(): Texture | Color {
		return this._diffuse;
	}

	public set diffuse(value: Texture | Color) {
		this._diffuse = value;
	}

	/**
	 *法线贴图
	 *
	 */
	private _normalMap: Texture = null;

	public get normalMap(): Texture {
		return this._normalMap;
	}

	public set normalMap(value: Texture) {
		this._normalMap = value;
	}

	/**
	 *
	 *法线贴图scale
	 */
	private _normalMapScale: number = 1;

	public get normalMapScale(): number {
		return this._normalMapScale;
	}

	public set normalMapScale(value: number) {
		this._normalMapScale = value;
	}

	setDefaultTransparentBlend() {
		this.blend = true;
		this.depthMask = false;

		if (this.premultiplyAlpha) {
            this.blendSrc = ONE;
            this.blendDst = ONE_MINUS_SRC_ALPHA;
            this.blendSrcAlpha = ONE;
            this.blendDstAlpha = ONE_MINUS_SRC_ALPHA;
        } else {
            this.blendSrc = SRC_ALPHA;
            this.blendDst = ONE_MINUS_SRC_ALPHA;
            this.blendSrcAlpha = SRC_ALPHA;
            this.blendDstAlpha = ONE_MINUS_SRC_ALPHA;
        }
	}

	/**
	 * 透明度剪裁，如果渲染的颜色透明度大于等于这个值的话渲染为完全不透明，否则渲染为完全透明
	 */
	private _alphaCutoff: number = 0;

	public get alphaCutoff(): number {
		return this._alphaCutoff;
	}

	public set alphaCutoff(value: number) {
		this._alphaCutoff = value;
	}

	/**
	 * 是否需要加基础 uniforms
	 */
	private _needBasicUnifroms: boolean = true;

	public get needBasicUnifroms(): boolean {
		return this._needBasicUnifroms;
	}

	public set needBasicUnifroms(value: boolean) {
		this._needBasicUnifroms = value;
	}

	/**
	 *
	 * 是否需要加基础 attributes
	 */
	private _needBasicAttributes: boolean = true;

	public get needBasicAttributes(): boolean {
		return this._needBasicAttributes;
	}

	public set needBasicAttributes(value: boolean) {
		this._needBasicAttributes = value;
	}


	public get isLoaded(): boolean {
		return true;
	}

	/**
	 * 可以通过指定，semantic来指定值的获取方式，或者自定义get方法
	 */
	private _uniforms: Object = {};

	public get uniforms(): Object {
		return this._uniforms;
	}

	public set uniforms(value: Object) {
		this._uniforms = value;
	}

	/**
	 * 可以通过指定，semantic来指定值的获取方式，或者自定义get方法
	 */
	private _attributes: Object = {};

	public get attributes(): Object {
		return this._attributes;
	}

	public set attributes(value: Object) {
		this._attributes = value;
	}

	/**
     * 渲染顺序数字小的先渲染（透明物体和不透明在不同的队列）
     */
    public renderOrder: number = 0;
	private _premultiplyAlpha: boolean = true;

	 /**
     * 是否预乘 alpha
     */
	get premultiplyAlpha() {
		return this._premultiplyAlpha;
	}

	set premultiplyAlpha(value) {
		this._premultiplyAlpha = value;
		if (this.transparent) {
			this.setDefaultTransparentBlend();
		}
	}


	public id: string;

	constructor() {

		this.id = math.generateUUID(this.getClassName());
		this.uniforms = {};
		this.attributes = {};

		if (this.needBasicAttributes) {
			this.addBasicAttributes();
		}

		if (this.needBasicUnifroms) {
			this.addBasicUniforms();
		}
	}

	/**
     * 增加基础 attributes
     */
	public addBasicAttributes() : void{
		let attributes: Object = this.attributes;
		this._copyProps(attributes, {
			a_position: 'POSITION',
			a_normal: 'NORMAL',
			a_tangent: 'TANGENT',
			a_texcoord0: 'TEXCOORD_0',
			a_texcoord1: 'TEXCOORD_1',
			a_color: 'COLOR_0',
			a_skinIndices: 'SKININDICES',
			a_skinWeights: 'SKINWEIGHTS'
		});

		['POSITION', 'NORMAL', 'TANGENT'].forEach((name: string): void => {
			let camelName: string = name.slice(0, 1) + name.slice(1).toLowerCase();
			for (let i = 0; i < 8; i++) {
				const morphAttributeName = 'a_morph' + camelName + i;
				if (attributes[morphAttributeName] === undefined) {
					attributes[morphAttributeName] = 'MORPH' + name + i;
				}
			}
		});
	}

	/**
	 *增加基础 uniforms
	 */
	public addBasicUniforms() : void{
		this._copyProps(this.uniforms, {
			u_modelMatrix: 'MODEL',
			u_viewMatrix: 'VIEW',
			u_projectionMatrix: 'PROJECTION',
			u_modelViewMatrix: 'MODELVIEW',
			u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
			u_viewInverseNormalMatrix: 'VIEWINVERSEINVERSETRANSPOSE',
			u_normalMatrix: 'MODELVIEWINVERSETRANSPOSE',
			u_normalWorldMatrix: 'MODELINVERSETRANSPOSE',
			u_cameraPosition: 'CAMERAPOSITION',
			u_rendererSize: 'RENDERERSIZE',
			u_logDepth: 'LOGDEPTH',

			// light
			u_ambientLightsColor: 'AMBIENTLIGHTSCOLOR',
			u_directionalLightsColor: 'DIRECTIONALLIGHTSCOLOR',
			u_directionalLightsInfo: 'DIRECTIONALLIGHTSINFO',
			u_directionalLightsShadowMap: 'DIRECTIONALLIGHTSSHADOWMAP',
			u_directionalLightsShadowMapSize: 'DIRECTIONALLIGHTSSHADOWMAPSIZE',
			u_directionalLightsShadowBias: 'DIRECTIONALLIGHTSSHADOWBIAS',
			u_directionalLightSpaceMatrix: 'DIRECTIONALLIGHTSPACEMATRIX',
			u_pointLightsPos: 'POINTLIGHTSPOS',
			u_pointLightsColor: 'POINTLIGHTSCOLOR',
			u_pointLightsInfo: 'POINTLIGHTSINFO',
			u_pointLightsRange: 'POINTLIGHTSRANGE',
			u_pointLightsShadowBias: 'POINTLIGHTSSHADOWBIAS',
			u_pointLightsShadowMap: 'POINTLIGHTSSHADOWMAP',
			u_pointLightSpaceMatrix: 'POINTLIGHTSPACEMATRIX',
			u_pointLightCamera: 'POINTLIGHTCAMERA',
			u_spotLightsPos: 'SPOTLIGHTSPOS',
			u_spotLightsDir: 'SPOTLIGHTSDIR',
			u_spotLightsColor: 'SPOTLIGHTSCOLOR',
			u_spotLightsCutoffs: 'SPOTLIGHTSCUTOFFS',
			u_spotLightsInfo: 'SPOTLIGHTSINFO',
			u_spotLightsRange: 'SPOTLIGHTSRANGE',
			u_spotLightsShadowMap: 'SPOTLIGHTSSHADOWMAP',
			u_spotLightsShadowMapSize: 'SPOTLIGHTSSHADOWMAPSIZE',
			u_spotLightsShadowBias: 'SPOTLIGHTSSHADOWBIAS',
			u_spotLightSpaceMatrix: 'SPOTLIGHTSPACEMATRIX',
			u_areaLightsPos: 'AREALIGHTSPOS',
			u_areaLightsColor: 'AREALIGHTSCOLOR',
			u_areaLightsWidth: 'AREALIGHTSWIDTH',
			u_areaLightsHeight: 'AREALIGHTSHEIGHT',
			u_areaLightsLtcTexture1: 'AREALIGHTSLTCTEXTURE1',
			u_areaLightsLtcTexture2: 'AREALIGHTSLTCTEXTURE2',

			// joint
			u_jointMat: 'JOINTMATRIX',
			u_jointMatTexture: 'JOINTMATRIXTEXTURE',
			u_jointMatTextureSize: 'JOINTMATRIXTEXTURESIZE',

			// quantization
			u_positionDecodeMat: 'POSITIONDECODEMAT',
			u_normalDecodeMat: 'NORMALDECODEMAT',
			u_uvDecodeMat: 'UVDECODEMAT',
			u_uv1DecodeMat: 'UV1DECODEMAT',

			// morph
			u_morphWeights: 'MORPHWEIGHTS',
			u_normalMapScale: 'NORMALMAPSCALE',
			u_emission: 'EMISSION',
			u_transparency: 'TRANSPARENCY',

			// uv matrix
			u_uvMatrix: 'UVMATRIX_0',
			u_uvMatrix1: 'UVMATRIX_1',

			// other info
			u_fogColor: 'FOGCOLOR',
			u_fogInfo: 'FOGINFO',
			u_alphaCutoff: 'ALPHACUTOFF',
			u_exposure: 'EXPOSURE',
			u_gammaFactor: 'GAMMAFACTOR',
		});

		this.addTextureUniforms({
			u_normalMap: 'NORMALMAP',
			u_parallaxMap: 'PARALLAXMAP',
			u_emission: 'EMISSION',
			u_transparency: 'TRANSPARENCY'
		});
	}

	/**
     * 增加贴图 uniforms
     * @param textureUniforms textureName:semanticName 键值对
     */
	public addTextureUniforms(textureUniforms: Object) : void {
		const uniforms = {};

		for (const uniformName in textureUniforms) {
			let semanticName: string = textureUniforms[uniformName];
			uniforms[uniformName] = semanticName;
			uniforms[`${uniformName}.texture`] = semanticName;
			uniforms[`${uniformName}.uv`] = `${semanticName}UV`;
		}
		this._copyProps(this.uniforms, uniforms);
	}

	protected _textureOption: TextureOptions = new TextureOptions();


	/**
	* 获取渲染选项值
	* @param  option 渲染选项值
	* @returns 渲染选项值
	*/
	public getRenderOption(option: RenderOptions = {}) : RenderOptions {
		const lightType = this.lightType;
		option[`LIGHT_TYPE_${lightType}`] = 1;
		option.SIDE = this.side;

		if (lightType !== 'NONE') {
			option.HAS_LIGHT = 1;
		}
		if (this.premultiplyAlpha) {
            option.PREMULTIPLY_ALPHA = 1;
        }

		let textureOption: TextureOptions = this._textureOption.reset(option);

		if (option.HAS_LIGHT) {
			option.HAS_NORMAL = 1;
			textureOption.add(this.normalMap, 'NORMAL_MAP', () => {
				if (this.normalMapScale !== 1) {
					option.NORMAL_MAP_SCALE = 1;
				}
			});
		}

		if (this.alphaCutoff > 0) {
			option.ALPHA_CUTOFF = 1;
		}

		if (this.uvMatrix) {
            option.UV_MATRIX = 1;
        }

        if (this.uvMatrix1) {
            option.UV_MATRIX1 = 1;
        }

		textureOption.update();
		return option;
	}


	public getUniformData(name: string, mesh: Mesh, programInfo) {
		return this.getUniformInfo(name).get(mesh, this, programInfo);
	}


	public getAttributeData(name: string, mesh: Mesh, programInfo) {
		return this.getAttributeInfo(name).get(mesh, this, programInfo);
	}

	public getUniformInfo(name: string) {
		return this.getInfo('uniforms', name);
	}

	public getAttributeInfo(name: string) {
		return this.getInfo('attributes', name);
	}

	public getInfo(dataType: string, name: string) {
		const dataDict = this[dataType];
		let info = dataDict[name];
		if (typeof info === 'string') {
			info = semantic[info];
		}

		if (!info || !info.get) {
			log.warnOnce('material.getInfo-' + name, 'Material.getInfo: no this semantic:' + name);
			info = blankInfo;
		}

		return info;
	}

	/**
	* 复制属性，只有没属性时才会覆盖
	* @param   dest
	* @param  src
	*/
	private _copyProps(dest: Object, src: Object) : void {
		for (const key in src) {
			if (dest[key] === undefined) {
				dest[key] = src[key];
			}
		}
	}

	 /**
     * 获取材质全部贴图
     * @returns
     */
    public getTextures() : Array<Texture>{
        const textures = [];
        for (const propName in this) {
            const texture = this[propName];
            if (texture && texture instanceof Texture) {
                textures.push(texture);
            }
        }

        return textures;
    }

	/**
     * 销毁贴图
     * @returns this
     */
    public destroyTextures() : void{
        this.getTextures().forEach((texture) => {
            texture.destroy();
        });
    }
}
