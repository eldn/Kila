/* eslint no-buffer-constructor: "off" */

import { glConstants } from "../constants/glConstants";
import { Pool } from "../utils/Pool";
import math from "../math/math";


const {
    ARRAY_BUFFER,
    ELEMENT_ARRAY_BUFFER,
    STATIC_DRAW
} = glConstants;

const cache = new Pool();

/**
 * 缓冲
 * @class
 */
class GLBuffer {

    /**
     * 缓存
     * @readOnly
     * @return {Cache}
     */
    static get cache() {
        return cache;
    }

    /**
     * 重置缓存
     */
    static reset(gl : WebGLRenderingContext) { // eslint-disable-line no-unused-vars
        cache.each((buffer) => {
            buffer.destroy();
        });
    }

    /**
     * 生成顶点缓冲
     * @param  {WebGLRenderingContext} gl
     * @param  {GeometryData} geometryData
     * @param  {GLenum} [usage = STATIC_DRAW]
     * @return {GLBuffer}
     */
    static createVertexBuffer(gl : WebGLRenderingContext, geometryData, usage = STATIC_DRAW) {
        return this.createBuffer(gl, ARRAY_BUFFER, geometryData, usage);
    }

    static createBuffer(gl, target, geometryData, usage) {
        const id = geometryData.bufferViewId;
        let buffer = cache.get(id);
        if (buffer) {
            return buffer;
        }
        geometryData.isDirty = false;
        buffer = new GLBuffer(gl, target, geometryData.data, usage);
        cache.add(id, buffer);
        return buffer;
    }

    /**
     * 生成索引缓冲
     * @param  {WebGLRenderingContext} gl
     * @param  {GeometryData} geometryData
     * @param  {GLenum} [usage = STATIC_DRAW]
     * @return {GLBuffer}
     */
    static createIndexBuffer(gl, geometryData, usage = STATIC_DRAW) {
        return this.createBuffer(gl, ELEMENT_ARRAY_BUFFER, geometryData, usage);
    }

    /**
     * id
     * @type {String}
     */
    id : string;

    gl : any;

    /**
     * target
     * @type {GLenum}
     */
    target : number;

     /**
     * usage
     * @type {GLenum}
     */
    usage : number;

    /**
     * buffer
     * @type {GLBuffer}
     */
    buffer : any;

    /**
     * @constructs
     * @param  {WebGLRenderingContext} gl
     * @param  {GLenum} [target = ARRAY_BUFFER]
     * @param  {TypedArray} data
     * @param  {GLenum} [usage = STATIC_DRAW]
     */
    constructor(gl, target = ARRAY_BUFFER, data, usage = STATIC_DRAW) {
        
        this.id = math.generateUUID(this.constructor.name);

        this.gl = gl;
        
        this.target = target;

       
        this.usage = usage;

        
        this.buffer = gl.createBuffer();

        if (data) {
            this.bufferData(data);
        }
    }

    getClassName() : string{
        return "GLBuffer";
    }

    /**
     * 绑定
     * @return {GLBuffer} this
     */
    bind() {
        this.gl.bindBuffer(this.target, this.buffer);
        return this;
    }


    data : any;

    /**
     * 上传数据
     * @param  {TypedArray} data
     * @return {GLBuffer} this
     */
    bufferData(data) {
        const {
            gl,
            target,
            usage
        } = this;

        this.bind();
        gl.bufferData(target, data, usage);
        this.data = data;
        return this;
    }

    /**
     * 上传部分数据
     * @param  {Number} byteOffset
     * @param  {TypedArray} data
     * @param  {Boolean} [isBinding=false]
     * @return {GLBuffer} this
     */
    bufferSubData(byteOffset, data, isBinding = false) {
        const {
            gl,
            target
        } = this;

        if (!isBinding) {
            this.bind();
        }
        gl.bufferSubData(target, byteOffset, data);
        return this;
    }

    /**
     * @param  {GeometryData} geometryData
     * @return {GLBuffer} this
     */
    uploadGeometryData(geometryData) {
        const subDataList = geometryData.subDataList;
        if (!this.data || this.data.byteLength < geometryData.data.byteLength || geometryData._isAllDirty === true) {
            this.bufferData(geometryData.data);
        } else if (subDataList && subDataList.length) {
            this.bind();
            subDataList.forEach((subData) => {
                this.bufferSubData(subData.byteOffset, subData.data, true);
            });
        } else {
            this.bufferData(geometryData.data);
        }
        geometryData.isDirty = false;
        return this;
    }

    /**
     * 没有被引用时销毁资源
     * @param  {WebGLRenderer} renderer
     * @return {GLBuffer} this
     */
    destroyIfNoRef(renderer) {
        const resourceManager = renderer.resourceManager;
        resourceManager.destroyIfNoRef(this);
        return this;
    }

    _isDestroyed : boolean;

    /**
     * 销毁资源
     * @return {GLBuffer} this
     */
    destroy() {
        if (this._isDestroyed) {
            return this;
        }

        this.gl.deleteBuffer(this.buffer);
        this.data = null;
        cache.removeObject(this);

        this._isDestroyed = true;
        return this;
    }
}

export default GLBuffer;
