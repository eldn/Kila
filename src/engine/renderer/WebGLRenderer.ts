import { EventObject } from "../event/EventObject";
import Color from "../math/Color";
import RenderInfo from "./RenderInfo";
import RenderList from "./RenderList";
import { LightManager } from "../light/LightManager";
import WebGLResourceManager from "./WebGLResourceManager";
import { WebGLState } from "./WebGlState";
import extensions from "./extensions";
import capabilities from "./capabilities";
import glType from "./glType";
import Shader from "../shader/shader";
import Program from "./Program";
import Texture from "../texture/Texture";
import GLBuffer from "./GLBuffer";
import { Material } from "../material/Material";
import { glConstants } from "../constants/glConstants";
import { Mesh } from "../core/Mesh";
import VertexArrayObject from "./VertexArrayObject";
import { Camera } from "../camera/Camera";
import { Scene } from "../core/Scene";
import { semantic } from "./Semantic";
import GameObject from "../core/GameObject";
import { Light } from "../light/Light";



const {
    DEPTH_TEST,
    SAMPLE_ALPHA_TO_COVERAGE,
    CULL_FACE,
    FRONT_AND_BACK,
    BLEND,
    LINES,
    STATIC_DRAW,
    DYNAMIC_DRAW
} = glConstants;

export class WebGLRenderer extends EventObject{

    /**
     * gl
     * @default null
     * @type {WebGLRenderingContext}
     */
    gl: WebGLRenderingContext = null;


     /**
     * 宽
     * @type {number}
     * @default 0
     */
    width : number =  0;

    /**
     * 高
     * @type {number}
     * @default 0
     */
    height: number = 0;


     /**
     * 偏移值
     * @type {Number}
     * @default 0
     */
    offsetX: number = 0;

    /**
     * 偏移值
     * @type {Number}
     * @default 0
     */
    offsetY: number = 0;

    /**
     * 像素密度
     * @type {number}
     * @default 1
     */
    pixelRatio: number = 1;


    /**
     * dom元素
     * @type {Canvas}
     * @default null
     */
    domElement: HTMLCanvasElement = null;

    /**
     * 是否开启透明背景
     * @type {boolean}
     * @default false
     */
    alpha: boolean = false;

    /**
     * @type {boolean}
     * @default true
     */
    depth: boolean = true;

    /**
     * @type {boolean}
     * @default false
     */
    stencil: boolean = false;

     /**
     * 顶点着色器精度, 可以是以下值：highp, mediump, lowp
     * @type {string}
     * @default highp
     */
    vertexPrecision: string = 'highp';

    /**
     * 片段着色器精度, 可以是以下值：highp, mediump, lowp
     * @type {string}
     * @default mediump
     */
    fragmentPrecision: string = 'highp';

     /**
     * 是否初始化失败
     * @default false
     * @type {Boolean}
     */
    isInitFailed: boolean = false;

    /**
     * 是否初始化
     * @type {Boolean}
     * @default false
     * @private
     */
    _isInit: boolean = false;

    /**
     * 是否lost context
     * @type {Boolean}
     * @default false
     * @private
     */
    _isContextLost: boolean = false;

    /**
     * 背景色
     * @type {Color}
     * @default new Color(1, 1, 1, 1)
     */
    clearColor : Color;

    /**
     * 渲染信息
     * @type {RenderInfo}
     * @default new RenderInfo
     */
    renderInfo : RenderInfo;

    /**
     * 渲染列表
     * @type {RenderList}
     * @default new RenderList
     */
    renderList : RenderList;

    /**
     * 资源管理器
     * @type {WebGLResourceManager}
     * @default new WebGLResourceManager
     */
    lightManager : LightManager;


    resourceManager : WebGLResourceManager;

    state : WebGLState;

    /**
     * 是否使用VAO
     * @type {Boolean}
     * @default true
     */
    useVao: boolean = true;

    constructor(domElement: HTMLCanvasElement, clearColor ?: Color) {
        super();
        if(clearColor){
            this.clearColor = clearColor;
        } else{
            this.clearColor  = new Color(1, 1, 1)
        }
        this.domElement = domElement;
        this.renderInfo = new RenderInfo();
        this.renderList = new RenderList();
        this.lightManager = new LightManager();
        this.resourceManager = new WebGLResourceManager();
    }


     /**
     * 改变大小
     * @param  {number} width  宽
     * @param  {number} height  高
     * @param  {boolean} [force=false] 是否强制刷新
     */
    resize(width : number, height : number, force : boolean) {
        if (force || this.width !== width || this.height !== height) {
            const canvas = this.domElement;
            this.width = width;
            this.height = height;
            canvas.width = width;
            canvas.height = height;
            this.viewport();
        }
    }

    /**
     * 设置viewport偏移值
     * @param {Number} x x
     * @param {Number} y y
     */
    setOffset(x : number, y : number) {
        if (this.offsetX !== x || this.offsetY !== y) {
            this.offsetX = x;
            this.offsetY = y;
            this.viewport();
        }
    }

     /**
     * 设置viewport
     * @param  {Number} [x=this.offsetX]  x
     * @param  {Number} [y=this.offsetY] y
     * @param  {Number} [width=this.gl.drawingBufferWidth]  width
     * @param  {Number} [height=this.gl.drawingBufferHeight]  height
     */
    viewport(x ?: number, y ?: number, width ?: number, height ?: number) {
        const {
            state,
            gl
        } = this;

        if (state) {
            if (x === undefined) {
                x = this.offsetX;
            } else {
                this.offsetX = x;
            }

            if (y === undefined) {
                y = this.offsetY;
            } else {
                this.offsetY = y;
            }

            if (width === undefined) {
                width = gl.drawingBufferWidth;
            }

            if (height === undefined) {
                height = gl.drawingBufferHeight;
            }

            state.viewport(x, y, width, height);
        }
    }

     /**
     * 是否初始化
     * @type {Boolean}
     * @default false
     * @readOnly
     */
    get isInit() : boolean{
        return this._isInit && !this.isInitFailed;
    }
    
    /**
     * 初始化回调
     * @return {WebGLRenderer} this
     */
    onInit(callback : Function) {
        if (this._isInit) {
            callback(this);
        } else {
            this.on('init', () => {
                callback(this);
            }, true);
        }
    }


     /**
     * 初始化 context
     */
    initContext() {
        if (!this._isInit) {
            this._isInit = true;
            try {
                this._initContext();
                this.fire('init');
            } catch (e) {
                this.isInitFailed = true;
                this.fire('initFailed', e);
            }
        }
    }

    private _initContext() {
        const contextAttributes = {
            alpha: this.alpha,
            depth: this.depth,
            stencil: this.stencil
        };
      

        let gl = this.gl = this.domElement.getContext('webgl', contextAttributes) as WebGLRenderingContext;
        gl.viewport(0, 0, this.width, this.height);

        glType.init(gl);
        extensions.init(gl);
        capabilities.init(gl);
        Shader.init(this);

        this.state = new WebGLState(gl);

       
        if (!extensions.vao) {
            this.useVao = false;
        }

        this.domElement.addEventListener('webglcontextlost', (e) => {
            this._onContextLost(e);
        }, false);

        this.domElement.addEventListener('webglcontextrestored', (e) => {
            this._onContextRestore(e);
        }, false);
    }

    private _lastMaterial : Material;
    private _lastProgram : Program;

    _onContextLost(e) {
        this.fire('webglContextLost');
        const gl = this.gl;
        this._isContextLost = true;

        e.preventDefault();

        Program.reset(gl);
        Shader.reset(gl);
        Texture.reset(gl);
        GLBuffer.reset(gl);
        this.state.reset(gl);

        this._lastMaterial = null;
        this._lastProgram = null;
    }

    _onContextRestore(e) { // eslint-disable-line no-unused-vars
        this.fire('webglContextRestored');
        const gl = this.gl;
        this._isContextLost = false;
        extensions.reset(gl);
    }

    /**
     * 设置深度检测
     * @param  {Material} material
     */
    setupDepthTest(material : Material) {
        const state = this.state;
        if (material.depthTest) {
            state.enable(DEPTH_TEST);
            state.depthFunc(material.depthFunc);
            state.depthMask(material.depthMask);
            state.depthRange(material.depthRange[0], material.depthRange[1]);
        } else {
            state.disable(DEPTH_TEST);
        }
    }

    /**
     * 设置背面剔除
     * @param  {Material} material
     */
    setupCullFace(material : Material) {
        const state = this.state;
        if (material.cullFace && material.cullFaceType !== FRONT_AND_BACK) {
            state.enable(CULL_FACE);
            state.cullFace(material.cullFaceType);
        } else {
            state.disable(CULL_FACE);
        }
    }

    /**
     * 设置混合
     * @param  {Material} material
     */
    setupBlend(material : Material) {
        const state = this.state;
        if (material.blend) {
            state.enable(BLEND);
            state.blendFuncSeparate(
                material.blendSrc,
                material.blendDst,
                material.blendSrcAlpha,
                material.blendDstAlpha
            );
            state.blendEquationSeparate(
                material.blendEquation,
                material.blendEquationAlpha
            );
        } else {
            state.disable(BLEND);
        }
    }


    forceMaterial : Material;


     /**
     * 设置vao
     * @param  {VertexArrayObject} vao
     * @param  {Program} program
     * @param  {Mesh} mesh
     */
    setupVao(vao : VertexArrayObject, program : Program, mesh : Mesh) {
        const geometry = mesh.geometry;
        const isStatic = geometry.isStatic;

        if (vao.isDirty || !isStatic || geometry.isDirty) {
            vao.isDirty = false;
            const material = this.forceMaterial || mesh.material;
            const materialAttributes = material.attributes;
            const usage = isStatic ? STATIC_DRAW : DYNAMIC_DRAW;
            for (let name in materialAttributes) {
                const programAttribute = program.attributes[name];
                if (programAttribute) {
                    const data = material.getAttributeData(name, mesh, programAttribute);
                    if (data !== undefined && data !== null) {
                        vao.addAttribute(data, programAttribute, usage);
                    }
                }
            }
            if (geometry.indices) {
                vao.addIndexBuffer(geometry.indices, usage);
            }

            geometry.isDirty = false;
        }

        if (geometry.vertexCount) {
            vao.vertexCount = geometry.vertexCount;
        }
    }

    /**
     * 设置通用的 uniform
     * @param  {Program} program
     * @param  {Mesh} mesh
     * @param  {Boolean} [force=false] 是否强制更新
     */
    setupUniforms(program : Program, mesh : Mesh,  force : boolean) {
        const material = this.forceMaterial || mesh.material;
        for (let name in program.uniforms) {
            const uniformInfo = material.getUniformInfo(name);
            const programUniformInfo = program.uniforms[name];
            if (!uniformInfo.isBlankInfo) {
                if (force || uniformInfo.isDependMesh) {
                    const uniformData = uniformInfo.get(mesh, material, programUniformInfo);
                    if (uniformData !== undefined && uniformData !== null) {
                        program[name] = uniformData;
                    }
                }
            }
        }
    }

    /**
     * 设置材质
     * @param  {Program} program
     * @param  {Mesh} mesh
     */
    setupMaterial(program : Program, mesh : Mesh, needForceUpdateUniforms : boolean = false) {
        const material = this.forceMaterial || mesh.material;
        if (material.isDirty || this._lastMaterial !== material) {
            this.setupDepthTest(material);
            this.setupCullFace(material);
            this.setupBlend(material);
            needForceUpdateUniforms = true;
        }

        this.setupUniforms(program, mesh,  needForceUpdateUniforms);
        material.isDirty = false;
        this._lastMaterial = material;
    }

      /**
     * 设置mesh
     * @param  {Mesh} mesh
     * @return {Object} res
     * @return {VertexArrayObject} res.vao
     * @return {Program} res.program
     * @return {Geometry} res.geometry
     */
    setupMesh(mesh : Mesh) {
        const gl = this.gl;
        const state = this.state;
        const lightManager = this.lightManager;
        const resourceManager = this.resourceManager;
        const geometry = mesh.geometry;
        const material = this.forceMaterial || mesh.material;
        const shader = Shader.getShader(mesh, material, lightManager);
        const program = Program.getProgram(shader, state);

        program.useProgram();
        this.setupMaterial(program, mesh, this._lastProgram !== program);
        this._lastProgram = program;

        if (mesh.material.wireframe && geometry.mode !== LINES) {
            geometry.convertToLinesMode();
        }

        const vaoId = geometry.id + program.id;
        const vao = VertexArrayObject.getVao(gl, vaoId, this.useVao, geometry.mode);

        this.setupVao(vao, program, mesh);

        resourceManager.useResource(vao, mesh).useResource(shader, mesh).useResource(program, mesh);

        return {
            vao,
            program,
            geometry
        };
    }


     /**
     * 增加渲染信息
     * @param {Number} faceCount 面数量
     * @param {Number} drawCount 绘图数量
     */
    addRenderInfo(faceCount : number, drawCount : number) {
        const renderInfo = this.renderInfo;
        renderInfo.addFaceCount(faceCount);
        renderInfo.addDrawCount(drawCount);
    }


    /**
     * 渲染
     * @param  {Stage} stage
     * @param  {Camera} camera
     * @param  {Boolean} [fireEvent=false] 是否发送事件
     */
    render(stage : Scene, camera : Camera, fireEvent  : boolean = false) {
        this.initContext();
        if (this.isInitFailed || this._isContextLost) {
            return;
        }

        const {
            renderList,
            renderInfo,
            lightManager,
            resourceManager,
            state
        } = this;

        lightManager.reset();
        renderInfo.reset();
        renderList.reset();
        resourceManager.reset();

        semantic.init(this, state, camera, lightManager);
        stage.updateMatrixWorld();
        camera.updateViewProjectionMatrix();

        stage.traverse((node : GameObject) => {
            if (!node.visible) {
                return GameObject.TRAVERSE_STOP_CHILDREN;
            }

            if (node instanceof Mesh) {
                renderList.addMesh(node, camera);
            } else if (node instanceof Light) {
                lightManager.addLight(node);
            }

            return GameObject.TRAVERSE_STOP_NONE;
        });

        renderList.sort();
        lightManager.updateInfo(camera);

        if (fireEvent) {
            this.fire('beforeRender');
        }

        this.clear();

        if (fireEvent) {
            this.fire('beforeRenderScene');
        }

        this.renderScene();

        if (fireEvent) {
            this.fire('afterRender');
        }

        resourceManager.destroyUnsuedResource();
    }

     /**
     * 渲染场景
     */
    renderScene() {
        const renderList = this.renderList;
        renderList.traverse((mesh) => {
            this.renderMesh(mesh);
        });
    }

     /**
     * 清除背景
     * @param  {Color} [clearColor=this.clearColor]
     */
    clear(clearColor ?: Color) {
        const {
            gl,
            state
        } = this;

        clearColor = clearColor || this.clearColor;

        state.depthMask(true);
        this._lastMaterial = null;
        this._lastProgram = null;
        gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }


     /**
     * 渲染一个mesh
     * @param  {Mesh} mesh
     */
    renderMesh(mesh) {
        const vao = this.setupMesh(mesh).vao;
        vao.draw();
        this.addRenderInfo(vao.vertexCount / 3, 1);
    }

     /**
     * 渲染一组普通mesh
     * @param  {Mesh[]} meshes
     */
    renderMultipleMeshes(meshes : Array<Mesh>) {
        meshes.forEach((mesh) => {
            this.renderMesh(mesh);
        });
    }

     /**
     * 销毁 WebGL 资源
     */
    releaseGLResource() {
        const gl = this.gl;
        if (gl) {
            Program.reset(gl);
            Shader.reset(gl);
            GLBuffer.reset(gl);
            VertexArrayObject.reset(gl);
            this.state.reset(gl);
            Texture.reset(gl);
        }
    }


}