import { Texture } from '../graphics/Texture';
import { MappedValues } from "./MappedValues";
import { gl } from '../gl/GLUtilities';

export class Material extends MappedValues {


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

	private m_textureHashMap: Map<string, Texture>;

	public get isLoaded(): boolean {
		let texturesName = this.m_textureHashMap.keys;
		for (let i: number; i < texturesName.length; ++i) {
			if (!this.m_textureHashMap.get(texturesName[i]).isLoaded) {
				return false;
			}
		}
		return true;
	}

	constructor(diffuse: Texture,
		specularIntensity: number,
		specularPower: number,
		normal: Texture,
		dispMap: Texture,
		dispMapScale: number,
		dispMapOffset: number) {
		super();
		this.m_textureHashMap = new Map<string, Texture>();

		this.AddTexture("diffuse", diffuse);
		this.AddFloat("specularIntensity", specularIntensity);
		this.AddFloat("specularPower", specularPower);
		this.AddTexture("normalMap", normal);
		this.AddTexture("dispMap", dispMap);

		let baseBias: number = dispMapScale / 2.0;
		this.AddFloat("dispMapScale", dispMapScale);
		this.AddFloat("dispMapBias", -baseBias + baseBias * dispMapOffset);
	}

	public AddTexture(name: string, texture: Texture): void {
		this.m_textureHashMap.set(name, texture);
	}

	public GetTexture(name: string): Texture {
		let result: Texture = this.m_textureHashMap.get(name);
		if (result != null)
			return result;

		return new Texture("test.png");
	}

	public load() {



	}
}
