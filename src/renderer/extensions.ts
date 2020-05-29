/**
 * WebGL 扩展管理，默认开启的扩展有：ANGLE_instanced_arrays, OES_vertex_array_object, OES_texture_float, WEBGL_lose_context, OES_element_index_uint, EXT_shader_texture_lod
 */
export class extensions{
    /**
     * ANGLE_instanced_arrays扩展
     */
    static instanced: any = undefined;

    /**
     * OES_vertex_array_object扩展
     */
    static vao: any = undefined;

    /**
     * OES_texture_float扩展
     */
    static texFloat: any = undefined;

    /**
     * WEBGL_lose_context扩展
     */
    static loseContext: any =  undefined;

    /**
     * EXT_texture_filter_anisotropic
     */
    static textureFilterAnisotropic: any =  undefined;


    static shaderTextureLod : any =  undefined;


    static uintIndices : any =  undefined;

    static _usedExtensions: Object = {};
    static _disabledExtensions: Object = {};
    static gl : WebGLRenderingContext;

    /**
     * 初始化
     * @param  gl
     */
    static init(gl : WebGLRenderingContext) : void {
        this.reset(gl);
    }

    /**
     * 重置扩展
     * @param  gl
     */
    static reset(gl : WebGLRenderingContext) : void {
        this.gl = gl;
        const usedExtensions = this._usedExtensions;
        for (let name in usedExtensions) {
            const alias = usedExtensions[name];
            this[alias] = undefined;
            this.get(name, alias);
        }
    }


    /**
     * 使用扩展
     * @param   name 扩展名称
     * @param alias别名，默认和 name 相同
     */
    static use(name : string, alias : string = name) : void {
        if (this.gl) {
            this.get(name, alias);
        } else {
            this._usedExtensions[name] = alias;
        }
    }


    /**
     * 获取扩展，如果不支持返回 null，必须在 Renderer 初始化完后用
     * @param   name 扩展名称
     * @param alias 别名，默认和 name 相同
     * @return 
     */
    static get(name : string, alias : string = name)  : any{
        if (this._disabledExtensions[name]) {
            return null;
        }

        let ext = this[alias];
        if (ext === undefined) {
            ext = this._getExtension(name);
            this[alias] = ext;
        }
        return ext;
    }

    /**
     * 禁止扩展
     * @param  name 扩展名称
     */
    static disable(name : string) : void {
        this._disabledExtensions[name] = true;
    }

    /**
     * 开启扩展
     * @param name 扩展名称
     */
    static enable(name : string) : void {
        this._disabledExtensions[name] = false;
    }

    static _getExtension(name : string) : any {
        const gl = this.gl;

        if (gl && gl.getExtension) {
            return gl.getExtension(name) || gl.getExtension('WEBKIT_' + name) || gl.getExtension('MOZ_' + name) || null;
        }
        return null;
    }
}

extensions.use('ANGLE_instanced_arrays', 'instanced');
extensions.use('OES_vertex_array_object', 'vao');
extensions.use('OES_texture_float', 'texFloat');
extensions.use('WEBGL_lose_context', 'loseContext');
extensions.use('OES_element_index_uint', 'uintIndices');
extensions.use('EXT_shader_texture_lod', 'shaderTextureLod');
extensions.use('EXT_texture_filter_anisotropic', 'textureFilterAnisotropic');

export default extensions;
