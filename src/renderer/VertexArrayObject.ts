import { glConstants } from "../constants/glConstants";
import { Pool } from "../utils/Pool";
import extensions from "./extensions";
import GLBuffer from "./GLBuffer";
import { GeometryData } from "../geometry/GeometryData";
import { WebGLResourceManager } from "./WebGLResourceManager";
import { Mesh } from "../core";
import { WebGLRenderer } from "./WebGLRenderer";

const {
    TRIANGLES
} = glConstants;

let globalStates = [];
let currentVao = null;
const cache = new Pool();


export class VertexArrayObject {
    
    /**
     * 缓存
     * @return
     */
    public static get cache() : Pool{
        return cache;
    }

    /**
     * 获取 vao
     * @param   gl
     * @param   id  缓存id
     * @param  params
     * @return 
     */
    public static getVao(gl : WebGLRenderingContext, id : string, useVao : boolean, mode : number) : VertexArrayObject {
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
     * @param  gl
     */
    public static reset(gl : WebGLRenderingContext) : void { 
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
    public static bindSystemVao() : void {
        if (extensions.vao) {
            extensions.vao.bindVertexArrayOES(null);
        }

        currentVao = null;
    }

    public getClassName() : string{
        return "VertexArrayObject";
    }

    public className: String = 'VertexArrayObject';


    /**
     * 顶点数量
     */
    vertexCount: number = null;

    /**
     * 是否使用 vao
     */
    useVao: Boolean = false;

    /**
     * 是否使用 instanced
     */
    useInstanced: Boolean = false;

    /**
     * 绘图方式
     */
    mode: number = TRIANGLES;

    /**
     * 是否脏
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
     * @param   gl
     * @param   id  缓存id
     */
    constructor(gl : WebGLRenderingContext, id : string, useVao : boolean, mode : number) {
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
    public bind() : void {
        if (currentVao !== this) {
            if (this.useVao) {
                this.vaoExtension.bindVertexArrayOES(this.vao);
            } else {
                this.bindSystemVao();
            }
            currentVao = this;
        }
    }

    public bindSystemVao() : void {
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
    public unbind() : void{
        if (this.useVao) {
            this.vaoExtension.bindVertexArrayOES(null);
        }
        currentVao = null;
    }

    /**
     * draw
     */
    public draw() : void{
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
     * @return  顶点数量
     */
    public getVertexCount() : number {
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
     * @param  primcount
     */
    public drawInstance(primcount : number = 1) : void {
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
     * @param data
     * @param usage gl.STATIC_DRAW|gl.DYNAMIC_DRAW
     * @return  Buffer
     */
    public addIndexBuffer(geometryData : GeometryData, usage : number) : GLBuffer {
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
     * @param  geometryData
     * @param  attribute
     * @param usage gl.STATIC_DRAW|gl.DYNAMIC_DRAW
     * @param onInit
     * @return  attributeObject
     */
    public addAttribute(geometryData : GeometryData, attribute : any, usage : number, onInit ?: Function) {
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
     * @param   resourceManager
     * @param   mesh
     * @return 
     */
    public useResource(resourceManager : WebGLResourceManager, mesh : Mesh) :VertexArrayObject  {
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
     * @param   renderer
     * @return this
     */
    public destroyIfNoRef(renderer : WebGLRenderer) : VertexArrayObject {
        const resourceManager = renderer.resourceManager;
        resourceManager.destroyIfNoRef(this);

        return this;
    }

    public _isDestroyed : boolean;

    /**
     * 销毁资源
     * @return this
     */
    public destroy() : VertexArrayObject {
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
