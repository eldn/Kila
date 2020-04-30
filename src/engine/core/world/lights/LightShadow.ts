import { Color } from "../../graphics/Color";import { Matrix4 } from "../../math/Matrix4";
import { Light } from "./Light";
import { Renderer } from "../../renderering/Renderer";
import { Camera } from "../cameras/Camera";
import { TObject } from "../../objects/Object";
import { DirectionLight } from "./DirectionLight";
import { SpotLight } from "./Spotlight";
import { PerspectiveCamera } from "../cameras/PerspectiveCamera";
import { FrameBuffer } from "../../renderering/FrameBuffer";
import { OrthographicCamera } from "../cameras/OrthographicCamera";
import { GeometryMaterial } from "../../material/GeometryMaterial";
import { DEPTH } from "../../define/Define";
import { gl } from "../../gl/GLUtilities";
import { semantic } from "../../renderering/Semantic";

let shadowMaterial = null;
const clearColor = new Color(1, 1, 1);
const tempMatrix4 = new Matrix4();

const isNeedRenderMesh = function(mesh) {
    return mesh.material.castShadows;
};

export class LightShadow extends TObject{

    light: Light = null;
    renderer: Renderer = null;
    framebuffer: any =  null;
    camera: Camera = null;
    width: number = 1024;
    height: number = 1024;
    maxBias: number = 0.05;
    minBias: number = 0.005;

    /**
     * 阴影摄像机信息
     * @type {Object}
     */
    cameraInfo: any = null;

    debug: boolean = false;


    constructor(params ?: any) {
        super();
        Object.assign(this, params);
    }


    createFramebuffer() {
        if (this.framebuffer) {
            return;
        }

        this.framebuffer = new FrameBuffer(this.renderer, this.width,this.height);

        if (this.debug) {
            this.showShadowMap();
        }
    }

    updateLightCamera(currentCamera : Camera) {
        if (this.light instanceof DirectionLight) {
            this.updateDirectionalLightCamera(currentCamera);
        } else if (this.light instanceof SpotLight) {
            this.updateSpotLightCamera(currentCamera);
        }
    }

    updateDirectionalLightCamera(currentCamera : Camera) {
        const light = this.light;

        this.camera.lookAt(light.direction);

        if (this.cameraInfo) {
            this.updateCustumCamera(this.cameraInfo);
        } else {
            const geometry = currentCamera.getGeometry();
            if (geometry) {
                this.camera.updateViewMatrix();
                tempMatrix4.multiply(this.camera.viewMatrix, currentCamera.worldMatrix);
                const bounds = geometry.getBounds(tempMatrix4);

                if(this.camera instanceof OrthographicCamera){
                    this.camera.near = -bounds.zMax;
                    this.camera.far = -bounds.zMin;
                    this.camera.left = bounds.xMin;
                    this.camera.right = bounds.xMax;
                    this.camera.bottom = bounds.yMin;
                    this.camera.top = bounds.yMax;
                }
                
            }
        }

        this.camera.updateViewMatrix();
    }

    updateCustumCamera(cameraInfo) {
        for (let name in cameraInfo) {
            this.camera[name] = cameraInfo[name];
        }
    }

    updateSpotLightCamera(currentCamera) {
        const light = this.light;
        this.camera.lookAt(light.direction);

        if (this.cameraInfo) {
            this.updateCustumCamera(this.cameraInfo);
        } else {
            if(this.camera instanceof PerspectiveCamera && light instanceof SpotLight){
                this.camera.fov = light.outerCutoff * 2;
                this.camera.near = 0.01;
                this.camera.far = currentCamera.far;
                this.camera.aspect = 1;
            }
        }

        this.camera.updateViewMatrix();
    }

    private _cameraMatrixVersion : number;

    createCamera(currentCamera) {
        if (!this.camera) {
            if (this.light instanceof DirectionLight) {
                this.camera = new OrthographicCamera();
            } else if (this.light instanceof SpotLight) {
                this.camera = new PerspectiveCamera();
            }
            this.light.owner.addChild(this.camera);
        }

        if (this._cameraMatrixVersion !== currentCamera.matrixVersion) {
            this.updateLightCamera(currentCamera);
            this._cameraMatrixVersion = currentCamera.matrixVersion;
        }
    }


    createShadowMap(currentCamera) {
        this.createFramebuffer();
        this.createCamera(currentCamera);

        const {
            renderer,
            framebuffer,
            camera
        } = this;

        if (!shadowMaterial) {
            shadowMaterial = new GeometryMaterial({
                vertexType: DEPTH,
                side: gl.BACK,
                writeOriginData: true
            });
        }

        framebuffer.bind();
        renderer.state.viewport(0, 0, this.width, this.height);
        renderer.clear(clearColor);
        camera.updateViewProjectionMatrix();
        semantic.setCamera(camera);
        renderer.forceMaterial = shadowMaterial;
        this.renderShadowScene(renderer);
        delete renderer.forceMaterial;
        framebuffer.unbind();
        semantic.setCamera(currentCamera);
        renderer.viewport();
    }

    renderShadowScene(renderer) {
        const renderList = renderer.renderList;
        renderList.traverse((mesh) => {
            if (isNeedRenderMesh(mesh)) {
                renderer.renderMesh(mesh);
            }
        }, (instancedMeshes) => {
            renderer.renderInstancedMeshes(instancedMeshes.filter(mesh => isNeedRenderMesh(mesh)));
        });
    }

    showShadowMap() {
        this.renderer.on('afterRender', () => {
            this.framebuffer.render(0, 0.7, 0.3, 0.3);
        });
    }




}