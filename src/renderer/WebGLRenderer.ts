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
import { Geometry } from "../geometry";



const {
    DEPTH_TEST,
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
     */
    gl: WebGLRenderingContext = null;


     /**
     * 宽
     */
    width : number =  0;

    /**
     * 高
     */
    height: number = 0;


     /**
     * 偏移值
     */
    offsetX: number = 0;

    /**
     * 偏移值
     */
    offsetY: number = 0;

    /**
     * 像素密度
     */
    pixelRatio: number = 1;


    /**
     * dom元素
     */
    domElement: HTMLCanvasElement = null;

    /**
     * 是否开启透明背景
     */
    alpha: boolean = false;

 
    depth: boolean = true;

  
    stencil: boolean = false;

     /**
     * 顶点着色器精度, 可以是以下值：highp, mediump, lowp
     */
    vertexPrecision: string = 'highp';

    /**
     * 片段着色器精度, 可以是以下值：highp, mediump, lowp
     */
    fragmentPrecision: string = 'highp';

     /**
     * 是否初始化失败
     */
    isInitFailed: boolean = false;

    /**
     * 是否初始化
     */
    _isInit: boolean = false;

    /**
     * 是否lost context
     */
    _isContextLost: boolean = false;

    /**
     * 背景色
     */
    clearColor : Color;

    /**
     * 渲染信息
     */
    renderInfo : RenderInfo;

    /**
     * 渲染列表
     */
    renderList : RenderList;

    /**
     * 资源管理器
     */
    lightManager : LightManager;


    resourceManager : WebGLResourceManager;

    state : WebGLState;

    /**
     * 是否使用VAO
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

    public getClassName() : string{
        return "WebGLRenderer";
    }

     /**
     * 改变大小
     * @param   width  宽
     * @param height  高
     * @param force 是否强制刷新
     */
    public resize(width : number, height : number, force : boolean = false) : void {
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
     * @param  x x
     * @param  y y
     */
    public setOffset(x : number, y : number) : void{
        if (this.offsetX !== x || this.offsetY !== y) {
            this.offsetX = x;
            this.offsetY = y;
            this.viewport();
        }
    }

     /**
     * 设置viewport
     * @param  x  x
     * @param  y y
     * @param  width  width
     * @param  height  height
     */
    public viewport(x : number = this.offsetX, y : number = this.offsetY, width : number = this.gl.drawingBufferWidth, height : number = this.gl.drawingBufferHeight) : void {
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
     */
    public get isInit() : boolean{
        return this._isInit && !this.isInitFailed;
    }
    
    /**
     * 初始化回调
     */
    public onInit(callback : Function){
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
    public initContext() : void {
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

    private _initContext() : void {
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

    private _onContextLost(e) : void {
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

    private _onContextRestore(e)  : void{ 
        this.fire('webglContextRestored');
        const gl = this.gl;
        this._isContextLost = false;
        extensions.reset(gl);
    }

    /**
     * 设置深度检测
     * @param  material
     */
    private setupDepthTest(material : Material) : void{
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
     * @param   material
     */
    private setupCullFace(material : Material) : void {
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
     * @param   material
     */
    setupBlend(material : Material) : void {
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
     * @param  vao
     * @param  program
     * @param  mesh
     */
    setupVao(vao : VertexArrayObject, program : Program, mesh : Mesh) : void {
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
    }

    /**
     * 设置通用的 uniform
     * @param   program
     * @param  mesh
     * @param  force 是否强制更新
     */
    setupUniforms(program : Program, mesh : Mesh,  force : boolean = false) : void {
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
     * @param   program
     * @param  mesh
     */
    setupMaterial(program : Program, mesh : Mesh, needForceUpdateUniforms : boolean = false) : void{
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
     * @param   mesh
     * @return res
     */
    setupMesh(mesh : Mesh) : {vao : VertexArrayObject, program : Program, geometry : Geometry}{
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
     * @param faceCount 面数量
     * @param  drawCount 绘图数量
     */
    addRenderInfo(faceCount : number, drawCount : number) : void{
        const renderInfo = this.renderInfo;
        renderInfo.addFaceCount(faceCount);
        renderInfo.addDrawCount(drawCount);
    }


    /**
     * 渲染
     * @param  stage
     * @param  camera
     * @param  fireEvent 是否发送事件
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
     * @param  clearColor
     */
    clear(clearColor : Color = this.clearColor) {
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
     * @param  mesh
     */
    renderMesh(mesh : Mesh) : void {
        const vao = this.setupMesh(mesh).vao;
        vao.draw();
        this.addRenderInfo(vao.vertexCount / 3, 1);
    }

     /**
     * 渲染一组普通mesh
     * @param  meshes
     */
    renderMultipleMeshes(meshes : Array<Mesh>) : void {
        meshes.forEach((mesh) => {
            this.renderMesh(mesh);
        });
    }

     /**
     * 销毁 WebGL 资源
     */
    releaseGLResource() : void{
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