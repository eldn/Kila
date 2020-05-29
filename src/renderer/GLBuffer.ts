/* eslint no-buffer-constructor: "off" */

import { glConstants } from "../constants/glConstants";
import { Pool } from "../utils/Pool";
import math from "../math/math";
import { GeometryData } from "../geometry/GeometryData";
import { WebGLRenderer } from "./WebGLRenderer";


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
export class GLBuffer {

    /**
     * 缓存
     * @return 
     */
    static get cache() : Pool {
        return cache;
    }

    /**
     * 重置缓存
     */
    static reset(gl : WebGLRenderingContext) : void { // eslint-disable-line no-unused-vars
        cache.each((buffer) => {
            buffer.destroy();
        });
    }

    /**
     * 生成顶点缓冲
     * @param   gl
     * @param  geometryData
     * @param  usage 
     * @return 
     */
    static createVertexBuffer(gl : WebGLRenderingContext, geometryData : GeometryData, usage : number = STATIC_DRAW) :GLBuffer {
        return this.createBuffer(gl, ARRAY_BUFFER, geometryData, usage);
    }

    static createBuffer(gl : WebGLRenderingContext, target : number, geometryData : GeometryData, usage : number) : GLBuffer{
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
     * @param   gl
     * @param  geometryData
     * @param  usage
     * @return
     */
    static createIndexBuffer(gl : WebGLRenderingContext, geometryData : GeometryData, usage : number = STATIC_DRAW) : GLBuffer{
        return this.createBuffer(gl, ELEMENT_ARRAY_BUFFER, geometryData, usage);
    }

   
    id : string;
    gl : WebGLRenderingContext;
    target : number;
    usage : number;
    buffer : WebGLBuffer;

    /**
     * @param  gl
     * @param  target
     * @param  data
     * @param  usage
     */
    constructor(gl : WebGLRenderingContext, target : number = ARRAY_BUFFER, data : TypedArray, usage  : number= STATIC_DRAW) {
        
        this.id = math.generateUUID(this.getClassName());

        this.gl = gl;
        
        this.target = target;

       
        this.usage = usage;

        
        this.buffer = gl.createBuffer();

        if (data) {
            this.bufferData(data);
        }
    }

    public getClassName() : string{
        return "GLBuffer";
    }

    /**
     * 绑定
     * @return  this
     */
    public bind() : GLBuffer{
        this.gl.bindBuffer(this.target, this.buffer);
        return this;
    }


    data : TypedArray;

    /**
     * 上传数据
     * @param  data
     * @return  this
     */
    public bufferData(data : TypedArray) : GLBuffer {
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
     * @param   byteOffset
     * @param   data
     * @param  sBinding
     * @return  this
     */
    public bufferSubData(byteOffset : number, data : TypedArray, isBinding : boolean = false) : GLBuffer {
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
     * @param  geometryData
     * @return  this
     */
    public uploadGeometryData(geometryData : GeometryData) :  GLBuffer{
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
    public destroyIfNoRef(renderer : WebGLRenderer) : GLBuffer {
        const resourceManager = renderer.resourceManager;
        resourceManager.destroyIfNoRef(this);
        return this;
    }

    _isDestroyed : boolean;

    /**
     * 销毁资源
     * @return this
     */
    public destroy() : GLBuffer{
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
