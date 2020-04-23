import { Texture } from '../graphics/Texture';
import { MappedValues } from "./MappedValues";
import { gl } from '../gl/GLUtilities';
import { TObject } from '../objects/Object';
import { RenderOptions } from './RenderOptions';
import { TextureOptions } from './TextureOptions';
import { Mesh } from '../graphics/Mesh';
import { log } from '../utils/Log';
import { semantic } from './Semantic';


const blankInfo = {
    isBlankInfo: true,
    get() {
        return undefined;
    }
};

export class Material extends TObject {

	/**
	 * 光照类型
	 *
	 * @private
	 * @type {string}
	 * @memberof Material
	 */
	private _lightType: string = 'NONE';

	public get lightType(): string {
		return this._lightType;
	}

	public set lightType(value: string) {
		this._lightType = value;
	}

	/**
	 * 是否显示网格
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _wireframe: boolean = false;

	public get wireframe(): boolean {
		return this._wireframe;
	}

	public set wireframe(value: boolean) {
		this._wireframe = value;
	}

	/**
	 * 
	 * 深度测试
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _depthTest: boolean = false;

	public get depthTest(): boolean {
		return this._depthTest;
	}

	public set depthTest(value: boolean) {
		this._depthTest = value;
	}

	/**
	 * 深度测试mask
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _depthMask: boolean = false;

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

	private _depthFunc: number = gl.LEQUAL;

	public get depthFunc(): number {
		return this._depthFunc;
	}

	public set depthFunc(value: number) {
		this._depthFunc = value;
	}

	private _cullFace: boolean = false;

	public get cullFace(): boolean {
		return this._cullFace;
	}

	public set cullFace(value: boolean) {
		this._cullFace = value;
		if (value) {
			this.cullFaceType = this._cullFaceType;
		} else {
			this._side = gl.FRONT_AND_BACK;
		}
	}

	private _cullFaceType: number = gl.BACK;

	public get cullFaceType(): number {
		return this._cullFaceType;
	}

	public set cullFaceType(value: number) {
		this._cullFaceType = value;
		if (this._cullFace) {
			if (value === gl.BACK) {
				this._side = gl.FRONT;
			} else if (value === gl.FRONT) {
				this._side = gl.BACK;
			}
		}
	}

	private _side: number = gl.FRONT;

	public get side(): number {
		return this._side;
	}

	public set side(value: number) {
		if (this._side !== value) {
			this._side = value;
			if (value === gl.FRONT_AND_BACK) {
				this._cullFace = false;
			} else {
				this._cullFace = true;
				if (value === gl.FRONT) {
					this._cullFaceType = gl.BACK;
				} else if (value === gl.BACK) {
					this._cullFaceType = gl.FRONT;
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

	private _blendEquation: number = gl.FUNC_ADD;

	public get blendEquation(): number {
		return this._blendEquation;
	}

	public set blendEquation(value: number) {
		this._blendEquation = value;
	}

	private _blendEquationAlpha: number = gl.FUNC_ADD;

	public get blendEquationAlpha(): number {
		return this._blendEquationAlpha;
	}

	public set blendEquationAlpha(value: number) {
		this._blendEquationAlpha = value;
	}

	private _blendSrc: number = gl.ONE;

	public get blendSrc(): number {
		return this._blendSrc;
	}

	public set blendSrc(value: number) {
		this._blendSrc = value;
	}

	private _blendDst: number = gl.ZERO;

	public get blendDst(): number {
		return this._blendDst;
	}

	public set blendDst(value: number) {
		this._blendDst = value;
	}

	private _blendSrcAlpha: number = gl.ONE;

	public get blendSrcAlpha(): number {
		return this._blendSrcAlpha;
	}

	public set blendSrcAlpha(value: number) {
		this._blendSrcAlpha = value;
	}

	private _blendDstAlpha: number = gl.ZERO;

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
	 *
	 * @private
	 * @type {number}
	 * @memberof Material
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
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
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

	/**
	 * 是否预乘 alpha
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _premultiplyAlpha: boolean = true;

	public get premultiplyAlpha(): boolean {
		return this._premultiplyAlpha;
	}

	public set premultiplyAlpha(value: boolean) {
		this._premultiplyAlpha = value;
		if (this.transparent) {
			this.setDefaultTransparentBlend();
		}
	}

	/**
	 *法线贴图
	 *
	 * @private
	 * @type {Texture}
	 * @memberof Material
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
	 * @private
	 * @type {number}
	 * @memberof Material
	 */
	private _normalMapScale: number = 1;

	public get normalMapScale(): number {
		return this._normalMapScale;
	}

	public set normalMapScale(value: number) {
		this._normalMapScale = value;
	}

	/**
	 *视差贴图
	 *
	 * @private
	 * @type {Texture}
	 * @memberof Material
	 */
	private _parallaxMap: Texture = null;

	public get parallaxMap(): Texture {
		return this._parallaxMap;
	}

	public set parallaxMap(value: Texture) {
		this._parallaxMap = value;
	}


	/**
	 * 是否忽略透明度
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _ignoreTranparent: boolean = false;

	public get ignoreTranparent(): boolean {
		return this._ignoreTranparent;
	}

	public set ignoreTranparent(value: boolean) {
		this._ignoreTranparent = value;
	}

	/**
	 * 是否开启 gamma 矫正
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _gammaCorrection: boolean = false;

	public get gammaCorrection(): boolean {
		return this._gammaCorrection;
	}

	public set gammaCorrection(value: boolean) {
		this._gammaCorrection = value;
	}

	/**
	 * gamma值
	 *
	 * @private
	 * @type {number}
	 * @memberof Material
	 */
	private _gammaFactor: number = 2.2;

	public get gammaFactor(): number {
		return this._gammaFactor;
	}

	public set gammaFactor(value: number) {
		this._gammaFactor = value;
	}

	/**
	 * 是否投射阴影
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _castShadows: boolean = true;

	public get castShadows(): boolean {
		return this._castShadows;
	}

	public set castShadows(value: boolean) {
		this._castShadows = value;
	}

	/**
	 * 是否接受阴影
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _receiveShadows: boolean = true;

	public get receiveShadows(): boolean {
		return this._receiveShadows;
	}

	public set receiveShadows(value: boolean) {
		this._receiveShadows = value;
	}


	/**
	 *
	 * 是否使用物理灯光
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _usePhysicsLight: boolean = false;

	public get usePhysicsLight(): boolean {
		return this._usePhysicsLight;
	}

	public set usePhysicsLight(value: boolean) {
		this._usePhysicsLight = value;
	}

	/**
	 *是否环境贴图和环境光同时生效
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _isDiffuesEnvAndAmbientLightWorkTogether: boolean = false;

	public get isDiffuesEnvAndAmbientLightWorkTogether(): boolean {
		return this._isDiffuesEnvAndAmbientLightWorkTogether;
	}

	public set isDiffuesEnvAndAmbientLightWorkTogether(value: boolean) {
		this._isDiffuesEnvAndAmbientLightWorkTogether = value;
	}

	setDefaultTransparentBlend() {
		this.blend = true;
		this.depthMask = false;
		if (this.premultiplyAlpha) {
			this.blendSrc = gl.ONE;
			this.blendDst = gl.ONE_MINUS_SRC_ALPHA;
			this.blendSrcAlpha = gl.ONE;
			this.blendDstAlpha = gl.ONE_MINUS_SRC_ALPHA;
		} else {
			this.blendSrc = gl.SRC_ALPHA;
			this.blendDst = gl.ONE_MINUS_SRC_ALPHA;
			this.blendSrcAlpha = gl.SRC_ALPHA;
			this.blendDstAlpha = gl.ONE_MINUS_SRC_ALPHA;
		}
	}

	/**
	 * 透明度剪裁，如果渲染的颜色透明度大于等于这个值的话渲染为完全不透明，否则渲染为完全透明
	 *
	 * @private
	 * @type {number}
	 * @memberof Material
	 */
	private _alphaCutoff: number = 0;

	public get alphaCutoff(): number {
		return this._alphaCutoff;
	}

	public set alphaCutoff(value: number) {
		this._alphaCutoff = value;
	}

	/**
	 *是否使用HDR
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
	 */
	private _useHDR: boolean = false;

	public get useHDR(): boolean {
		return this._useHDR;
	}

	public set useHDR(value: boolean) {
		this._useHDR = value;
	}

	/**
	 *曝光度，仅在 useHDR 为 true 时生效
	 *
	 * @private
	 * @type {number}
	 * @memberof Material
	 */
	private _hdrExposure: number = 1;

	public get hdrExposure(): number {
		return this._hdrExposure;
	}

	public set hdrExposure(value: number) {
		this._hdrExposure = value;
	}

	/**
	 * 是否需要加基础 uniforms
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Material
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
	 * @private
	 * @type {boolean}
	 * @memberof Material
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
	 *可以通过指定，semantic来指定值的获取方式，或者自定义get方法
	 *
	 * @private
	 * @type {Object}
	 * @memberof Material
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
	 *
	 * @private
	 * @type {Object}
	 * @memberof Material
	 */
	private _attributes: Object = {};

	public get attributes(): Object {
		return this._attributes;
	}

	public set attributes(value: Object) {
		this._attributes = value;
	}


	constructor() {
		super()


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
	addBasicAttributes() {
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
	* 增加基础 uniforms
	*/
	addBasicUniforms() {
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
     * @param {Object} textureUniforms textureName:semanticName 键值对
     */
	addTextureUniforms(textureUniforms: Object) {
		const uniforms = {};

		for (const uniformName in textureUniforms) {
			let semanticName: string = textureUniforms[uniformName];
			uniforms[uniformName] = semanticName;
			uniforms[`${uniformName}.texture`] = semanticName;
			uniforms[`${uniformName}.uv`] = `${semanticName}UV`;
		}
		this._copyProps(this.uniforms, uniforms);
	}

	_textureOption: TextureOptions = new TextureOptions();


	 /**
     * 获取渲染选项值
     * @param  {Object} [option={}] 渲染选项值
     * @return {Object} 渲染选项值
     */
    getRenderOption(option: RenderOptions) {
			const lightType = this.lightType;
			option[`LIGHT_TYPE_${lightType}`] = 1;
			option.SIDE = this.side;

			if (lightType !== 'NONE') {
				option.HAS_LIGHT = 1;
			}

			if (this.premultiplyAlpha) {
				option.PREMULTIPLY_ALPHA = 1;
			}

			let textureOption : TextureOptions = this._textureOption.reset(option);

			if (option.HAS_LIGHT) {
				option.HAS_NORMAL = 1;
				textureOption.add(this.normalMap, 'NORMAL_MAP', () => {
					if (this.normalMapScale !== 1) {
						option.NORMAL_MAP_SCALE = 1;
					}
				});
			}

			textureOption.add(this.parallaxMap, 'PARALLAX_MAP');
			// textureOption.add(this.emission, 'EMISSION_MAP');
			// textureOption.add(this.transparency, 'TRANSPARENCY_MAP');

			if (this.ignoreTranparent) {
				option.IGNORE_TRANSPARENT = 1;
			}

			if (this.alphaCutoff > 0) {
				option.ALPHA_CUTOFF = 1;
			}

			if (this.useHDR) {
				option.USE_HDR = 1;
			}

			if (this.gammaCorrection) {
				option.GAMMA_CORRECTION = 1;
			}

			if (this.receiveShadows) {
				option.RECEIVE_SHADOWS = 1;
			}

			if (this.castShadows) {
				option.CAST_SHADOWS = 1;
			}

			if (this.usePhysicsLight) {
				option.USE_PHYSICS_LIGHT = 1;
			}

			if (this.isDiffuesEnvAndAmbientLightWorkTogether) {
				option.IS_DIFFUESENV_AND_AMBIENTLIGHT_WORK_TOGETHER = 1;
			}

			textureOption.update();
			return option;
		}


		getUniformData(name : string, mesh : Mesh, programInfo) {
			return this.getUniformInfo(name).get(mesh, this, programInfo);
		}


		getAttributeData(name :string, mesh : Mesh, programInfo) {
			return this.getAttributeInfo(name).get(mesh, this, programInfo);
		}

		getUniformInfo(name :string) {
			return this.getInfo('uniforms', name);
		}

		getAttributeInfo(name : string) {
			return this.getInfo('attributes', name);
		}

		getInfo(dataType :string, name :string) {
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


	public load() {

		}

	 /**
     * 复制属性，只有没属性时才会覆盖
     * @private
     * @param  {Object} dest
     * @param  {Object} src
     */
    private _copyProps(dest: Object, src: Object) {
			for (const key in src) {
				if (dest[key] === undefined) {
					dest[key] = src[key];
				}
			}
		}
	}
