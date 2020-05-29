import extensions from './extensions';

/**
 * WebGL 能力
 */
export class capabilities{
    /**
     * 最大纹理数量
     */
    static MAX_TEXTURE_INDEX: number = null;

    /**
     * 最高着色器精度, 可以是以下值：highp, mediump, lowp
     */
    static MAX_PRECISION: string = null;

    /**
     * 最高顶点着色器精度, 可以是以下值：highp, mediump, lowp
     */
    static MAX_VERTEX_PRECISION: string = null;

    /**
     * 最高片段着色器精度, 可以是以下值：highp, mediump, lowp
     */
    static MAX_FRAGMENT_PRECISION: string = null;

    /**
     * 顶点浮点数纹理
     */
    static VERTEX_TEXTURE_FLOAT: boolean = null;

    /**
     * 片段浮点数纹理
     */
    static FRAGMENT_TEXTURE_FLOAT: boolean = null;

    /**
     * MAX_TEXTURE_MAX_ANISOTROPY
     */
    static MAX_TEXTURE_MAX_ANISOTROPY: number = 1;

    static gl : WebGLRenderingContext;


    static EXT_FRAG_DEPTH : any;
    static SHADER_TEXTURE_LOD : any;

    static MAX_RENDERBUFFER_SIZE : number;
    static MAX_COMBINED_TEXTURE_IMAGE_UNITS : number;
    static MAX_CUBE_MAP_TEXTURE_SIZE : number;
    static MAX_FRAGMENT_UNIFORM_VECTORS : number;
    static MAX_TEXTURE_IMAGE_UNITS : number;
    static MAX_TEXTURE_SIZE : number;
    static MAX_VARYING_VECTORS : number;
    static MAX_VERTEX_ATTRIBS : number;
    static MAX_VERTEX_TEXTURE_IMAGE_UNITS : number;
    static MAX_VERTEX_UNIFORM_VECTORS : number;

    /**
     * 初始化
     * @param  gl
     */
    static init(gl : WebGLRenderingContext) : void {
        this.gl = gl;
        const arr = [
            'MAX_RENDERBUFFER_SIZE',
            'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
            'MAX_CUBE_MAP_TEXTURE_SIZE',
            'MAX_FRAGMENT_UNIFORM_VECTORS',
            'MAX_TEXTURE_IMAGE_UNITS',
            'MAX_TEXTURE_SIZE',
            'MAX_VARYING_VECTORS',
            'MAX_VERTEX_ATTRIBS',
            'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
            'MAX_VERTEX_UNIFORM_VECTORS'
        ];

        arr.forEach((name) => {
            this.get(name);
        });

        this.MAX_TEXTURE_INDEX = this.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1;
        this.MAX_VERTEX_PRECISION = this._getMaxSupportPrecision(gl.VERTEX_SHADER);
        this.MAX_FRAGMENT_PRECISION = this._getMaxSupportPrecision(gl.FRAGMENT_SHADER);
        this.MAX_PRECISION = this.getMaxPrecision(this.MAX_FRAGMENT_PRECISION, this.MAX_VERTEX_PRECISION);

        this.VERTEX_TEXTURE_FLOAT = !!extensions.texFloat && this.MAX_VERTEX_TEXTURE_IMAGE_UNITS > 0;
        this.FRAGMENT_TEXTURE_FLOAT = !!extensions.texFloat;
        this.EXT_FRAG_DEPTH = extensions.get('EXT_frag_depth');
        this.SHADER_TEXTURE_LOD = !!extensions.shaderTextureLod;


        if (extensions.textureFilterAnisotropic) {
            this.MAX_TEXTURE_MAX_ANISOTROPY = gl.getParameter(extensions.textureFilterAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        }
    }

    /**
     * 获取 WebGL 能力
     * @param  name
     * @return
     */
    static get(name : string) : number | string {
        const gl = this.gl;
        let value = this[name];
        if (value === undefined) {
            value = this[name] = gl.getParameter(gl[name]);
        }

        return value;
    }

    static _getMaxSupportPrecision(shaderType : number) : string {
        const gl = this.gl;

        let maxPrecision = 'lowp';

        if (gl.getShaderPrecisionFormat) {
            const precisions = [{
                name: 'highp',
                type: gl.HIGH_FLOAT,
            }, {
                name: 'mediump',
                type: gl.MEDIUM_FLOAT
            }];

            for (let i = 0; i < precisions.length; i++) {
                const precision = precisions[i];
                const precisionFormat : WebGLShaderPrecisionFormat | null = gl.getShaderPrecisionFormat(shaderType, precision.type);
                if (precisionFormat && precisionFormat.precision > 0) {
                    maxPrecision = precision.name;
                    break;
                }
            }
        } else {
            maxPrecision = 'mediump';
        }

        return maxPrecision;
    }

    /**
     * 获取最大支持精度
     * @param  a
     * @param   b
     * @return
     */
    static getMaxPrecision(a : string, b : string) : string {
        if (a === 'highp' || (a === 'mediump' && b === 'lowp')) {
            return b;
        }

        return a;
    }
}

export default capabilities;
