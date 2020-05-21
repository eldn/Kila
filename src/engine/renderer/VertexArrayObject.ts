import { glConstants } from "../constants/glConstants";
import { Pool } from "../utils/Pool";
import extensions from "./extensions";
import GLBuffer from "./GLBuffer";
import { log } from "../utils/Log";
import bufferUtil from "../utils/bufferUtil";


const {
    TRIANGLES
} = glConstants;

let globalStates = [];
let currentVao = null;
const cache = new Pool();

/**
 * VAO
 * @class
 */
export class VertexArrayObject {
    
    /**
     * 缓存
     * @readOnly
     * @return {Cache}
     */
    static get cache(){
        return cache;
    }

    /**
     * 获取 vao
     * @param  {WebGLRenderingContext} gl
     * @param  {String} id  缓存id
     * @param  {Object} params
     * @return {VertexArrayObject}
     */
    static getVao(gl, id, useVao : boolean, mode : number) {
        let vao = cache.get(id);
        if (!vao) {
            vao = new VertexArrayObject(gl, id, useVao, mode);
            cache.add(id, vao);
        } else if (mode && mode !== vao.mode) {
            // for geometry.mode change
            vao.mode = mode;
        }

        return vao;
    }


    /**
     * 重置所有vao
     * @param  {WebGLRenderingContext} gl
     */
    static reset(gl) { // eslint-disable-line no-unused-vars
        currentVao = null;
        globalStates = [];
        this.bindSystemVao();
        cache.each((vao) => {
            vao.destroy(gl);
        });
    }


    /**
     * 绑定系统vao
     */
    static bindSystemVao() {
        if (extensions.vao) {
            extensions.vao.bindVertexArrayOES(null);
        }

        currentVao = null;
    }

    getClassName() : string{
        return "VertexArrayObject";
    }

    /**
     * @default VertexArrayObject
     * @type {String}
     */
    className: String = 'VertexArrayObject';

    /**
     * @default true
     * @type {Boolean}
     */
    isVertexArrayObject: Boolean = true;

    /**
     * 顶点数量
     * @type {Number}
     * @private
     */
    vertexCount: number = null;

    /**
     * 是否使用 vao
     * @type {Boolean}
     * @default false
     */
    useVao: Boolean = false;

    /**
     * 是否使用 instanced
     * @type {Boolean}
     * @default false
     */
    useInstanced: Boolean = false;

    /**
     * 绘图方式
     * @type {GLEnum}
     * @default gl.TRIANGLES
     */
    mode: number = TRIANGLES;

    /**
     * 是否脏
     * @type {Boolean}
     * @default true
     */
    isDirty: boolean = true;

    gl : WebGLRenderingContext;

    id : string;

    vaoExtension : any;

    instancedExtension : any;

    vao : any;

    attributes : Array<any>;
    activeStates : Array<any>;
    indexBuffer : any;
    indexType : number;

    /**
     * @constructs
     * @param  {WebGLRenderingContext} gl
     * @param  {String} id  缓存id
     * @param  {Object} params
     */
    constructor(gl, id, useVao : boolean, mode : number) {
        this.gl = gl;
        this.id = id;
        this.vaoExtension = extensions.vao;
        this.instancedExtension = extensions.instanced;

        this.useVao = useVao;
        this.mode = mode;

        if (!this.vaoExtension) {
            this.useVao = false;
        }

        if (!this.instancedExtension) {
            this.useInstanced = false;
        }

        if (this.useVao) {
            this.vao = this.vaoExtension.createVertexArrayOES();
        }

        this.attributes = [];
        this.activeStates = [];
        this.indexBuffer = null;
    }

    /**
     * bind
     */
    bind() {
        if (currentVao !== this) {
            if (this.useVao) {
                this.vaoExtension.bindVertexArrayOES(this.vao);
            } else {
                this.bindSystemVao();
            }
            currentVao = this;
        }
    }

    /**
     * @private
     */
    bindSystemVao() {
        const gl = this.gl;
        if (currentVao && currentVao.useVao) {
            currentVao.unbind();
        }
        const activeStates = this.activeStates;

        let lastBuffer;
        this.attributes.forEach((attributeObject) => {
            const {
                buffer,
                attribute,
                geometryData
            } = attributeObject;

            if (lastBuffer !== buffer) {
                lastBuffer = buffer;
                buffer.bind();
            }

            attribute.enable();
            attribute.pointer(geometryData);
            if (attributeObject.useInstanced) {
                attribute.divisor(1);
            } else {
                attribute.divisor(0);
            }
        });

        globalStates.forEach((globalAttributeObject, i) => {
            const activeAttributeObject = activeStates[i];
            if (globalAttributeObject && !activeAttributeObject) {
                globalAttributeObject.attribute.divisor(0);
                gl.disableVertexAttribArray(i);
            }
        });

        if (this.indexBuffer) {
            this.indexBuffer.bind();
        }
        globalStates = activeStates;
    }

    /**
     * unbind
     */
    unbind() {
        if (this.useVao) {
            this.vaoExtension.bindVertexArrayOES(null);
        }
        currentVao = null;
    }

    /**
     * draw
     */
    draw() {
        this.bind();
        const {
            gl,
            mode
        } = this;

        if (this.indexBuffer) {
            gl.drawElements(mode, this.vertexCount, this.indexType, 0);
        } else {
            gl.drawArrays(mode, 0, this.getVertexCount());
        }
    }

    /**
     * 获取顶点数量
     * @return {Number} 顶点数量
     */
    getVertexCount() {
        if (this.vertexCount === null) {
            const attributeObj = this.attributes[0];
            if (attributeObj) {
                this.vertexCount = attributeObj.geometryData.count;
            } else {
                this.vertexCount = 0;
            }
        }
        return this.vertexCount;
    }
    /**
     * drawInstance
     * @param  {Number} [primcount=1]
     */
    drawInstance(primcount = 1) {
        this.bind();
        const {
            gl,
            mode
        } = this;
        if (this.useInstanced) {
            if (this.indexBuffer) {
                this.instancedExtension.drawElementsInstancedANGLE(mode, this.vertexCount, gl.UNSIGNED_SHORT, 0, primcount);
            } else {
                this.instancedExtension.drawArraysInstancedANGLE(mode, 0, this.getVertexCount(), primcount);
            }
        }
    }
    /**
     * addIndexBuffer
     * @param {GeometryData} data
     * @param {GLenum} usage gl.STATIC_DRAW|gl.DYNAMIC_DRAW
     * @return {GLBuffer} Buffer
     */
    addIndexBuffer(geometryData, usage) {
        this.bind();
        const gl = this.gl;
        let buffer = this.indexBuffer;
        this.indexType = geometryData.type;
        if (!buffer) {
            buffer = GLBuffer.createIndexBuffer(gl, geometryData, usage);
            buffer.bind();
            this.indexBuffer = buffer;
            this.vertexCount = geometryData.length;
        } else if (geometryData.isDirty) {
            buffer.uploadGeometryData(geometryData);
            this.vertexCount = geometryData.length;
        }

        return buffer;
    }
    /**
     * addAttribute
     * @param {GeometryData} geometryData
     * @param {Object} attribute
     * @param {GLenum} usage gl.STATIC_DRAW|gl.DYNAMIC_DRAW
     * @param {Function} onInit
     * @return {AttributeObject} attributeObject
     */
    addAttribute(geometryData, attribute, usage, onInit ?: Function) {
        this.bind();
        const gl = this.gl;
        const name = attribute.name;

        let attributeObject = this[name];
        if (!attributeObject) {
            const buffer = GLBuffer.createVertexBuffer(gl, geometryData, usage);
            buffer.bind();
            attribute.enable();
            attribute.pointer(geometryData);
            attributeObject = {
                attribute,
                buffer,
                geometryData
            };
            this.attributes.push(attributeObject);
            this[name] = attributeObject;
            attribute.addTo(this.activeStates, attributeObject);
            if (onInit) {
                onInit(attributeObject);
            }
        } else if (geometryData.isDirty) {
            attributeObject.buffer.uploadGeometryData(geometryData);
        }

        return attributeObject;
    }

    /**
     * 使用了资源
     * @param  {WebGLResourceManager} resourceManager
     * @param  {Mesh} mesh
     * @return {VertexArrayObject}
     */
    useResource(resourceManager, mesh) {
        this.attributes.forEach((attributeObject) => {
            resourceManager.useResource(attributeObject.buffer, mesh);
        });

        if (this.indexBuffer) {
            resourceManager.useResource(this.indexBuffer, mesh);
        }

        return this;
    }
    /**
     * 没有被引用时销毁资源
     * @param  {WebGLRenderer} renderer
     * @return {VertexArrayObject} this
     */
    destroyIfNoRef(renderer) {
        const resourceManager = renderer.resourceManager;
        resourceManager.destroyIfNoRef(this);

        return this;
    }

    _isDestroyed : boolean;

    /**
     * 销毁资源
     * @return {VertexArrayObject} this
     */
    destroy() {
        if (this._isDestroyed) {
            return this;
        }

        if (this.useVao) {
            this.vaoExtension.deleteVertexArrayOES(this.vao);
        }
        this.gl = null;
        this.indexBuffer = null;
        this.attributes.forEach((attributeObject) => {
            const attribute = attributeObject;
            this[attribute.name] = null;
        });
        this.attributes = null;
        this.activeStates = null;
        cache.removeObject(this);

        this._isDestroyed = true;
        return this;
    }
}

export default VertexArrayObject;
