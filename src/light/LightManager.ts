import { Matrix4 } from "../math/Matrix4";
import { Vector3 } from "../math/Vector3";
import { Utils } from "../math/Utils";
import { log } from "../utils/Log";
import { DirectionLight } from "./DirectionLight";
import AmbientLight from "./AmbientLight";
import { Light } from "./Light";
import { Camera } from "../camera";
import { AreaLight } from "./AreaLight";
import { PointLight } from "./PointLight";
import { SpotLight } from "./SpotLight";


const tempMatrix4 = new Matrix4();
const tempVector3 = new Vector3();
const tempFloat32Array = new Float32Array([0, 0, 0]);


export interface iLightInfo {
    uid : string;

    AMBIENT_LIGHTS : number;
    POINT_LIGHTS : number;
    DIRECTIONAL_LIGHTS : number;
    SPOT_LIGHTS : number;
    AREA_LIGHTS : number;

    SHADOW_POINT_LIGHTS : number;
    SHADOW_SPOT_LIGHTS : number;
    SHADOW_DIRECTIONAL_LIGHTS : number;
}

/**
 * 光管理类
 * @class
 */
export class LightManager {


    public pointLights: Array<PointLight>;
    public spotLights: Array<SpotLight>;
    public areaLights: Array<AreaLight>;
    public ambientLights: Array<AmbientLight>;
    public directionalLights: Array<DirectionLight>;
    public lightInfo: iLightInfo;

    public directionalInfo: any;
    public pointInfo: any;
    public spotInfo: any;
    public areaInfo: any;
    public ambientInfo: any;

    constructor() {
        this.ambientLights = [];
        this.directionalLights = [];
        this.pointLights = [];
        this.spotLights = [];
        this.areaLights = [];
        this.lightInfo = {

            uid: "",

            AMBIENT_LIGHTS: 0,
            POINT_LIGHTS: 0,
            DIRECTIONAL_LIGHTS: 0,
            SPOT_LIGHTS: 0,
            AREA_LIGHTS: 0,

            SHADOW_POINT_LIGHTS : 0,
            SHADOW_SPOT_LIGHTS : 0,
            SHADOW_DIRECTIONAL_LIGHTS : 0,

            
        };
    }

    public getClassName(): string {
        return "LightManager";
    }

    public getRenderOption(option: Object = {}): Object {
        Utils.each(this.lightInfo, (count, name) => {
            if (name === 'uid' || !count) {
                return;
            }
            option[name] = count;
        });
        return option;
    }

    /**
     * 增加光
     * @param light 光源
     * @returns this
     */
    public addLight(light: Light): LightManager {
        let lights = null;

        if (!light.enabled) {
            return this;
        }

        if (light instanceof DirectionLight) {
            lights = this.directionalLights;
        }
        else if (light instanceof AmbientLight) {
            lights = this.ambientLights;
        }
        else if (light instanceof AreaLight) {
            lights = this.areaLights;
        }
        else {
            log.warnOnce(`LightManager.addLight(${light.id})`, 'Not support this light:', light);
        }

        if (lights) {
            lights.push(light);
        }

        return this;
    }

    /**
     * 获取方向光信息
     * @param  camera 摄像机
     * @returns
     */
    public getDirectionalInfo(camera: Camera) {
        const colors = [];
        const infos = [];

        this.directionalLights.forEach((light, index) => {
            const offset = index * 3;
            light.getRealColor().toRGBArray(colors, offset);
            light.getViewDirection(camera).toArray(infos, offset);
        });

        const result = {
            colors: new Float32Array(colors),
            infos: new Float32Array(infos)
        };

        return result;
    }

    /**
     * 获取聚光灯信息
     * @param  camera 摄像机
     * @returns
     */
    public getSpotInfo(camera: Camera) {
        const colors = [];
        const infos = [];
        const poses = [];
        const dirs = [];
        const cutoffs = [];
        const ranges = [];

        this.spotLights.forEach((light, index) => {
            const offset = index * 3;
            light.getRealColor().toRGBArray(colors, offset);
            light.toInfoArray(infos, offset);
            light.getViewDirection(camera).toArray(dirs, offset);
            ranges.push(light.range);
            cutoffs.push(light._cutoffCos, light._outerCutoffCos);

            camera.getModelViewMatrix(light, tempMatrix4);
            tempMatrix4.getTranslation(tempVector3);
            tempVector3.toArray(poses, offset);
        });

        const result = {
            colors: new Float32Array(colors),
            infos: new Float32Array(infos),
            poses: new Float32Array(poses),
            dirs: new Float32Array(dirs),
            cutoffs: new Float32Array(cutoffs),
            ranges: new Float32Array(ranges)
        };


        return result;
    }

    /**
     * 获取点光源信息
     * @param   camera 摄像机
     * @returns
     */
    public getPointInfo(camera : Camera) {
        const colors = [];
        const infos = [];
        const poses = [];
        const ranges = [];

        this.pointLights.forEach((light, index) => {
            const offset = index * 3;
            light.getRealColor().toRGBArray(colors, offset);
            light.toInfoArray(infos, offset);
            ranges.push(light.range);

            camera.getModelViewMatrix(light, tempMatrix4);
            tempMatrix4.getTranslation(tempVector3);
            tempVector3.toArray(poses, offset);
        });

        const result = {
            colors: new Float32Array(colors),
            infos: new Float32Array(infos),
            poses: new Float32Array(poses),
            ranges: new Float32Array(ranges)
        };

        return result;
    }

    /**
     * 获取面光源信息
     * @param camera 摄像机
     * @returns
     */
    public getAreaInfo(camera: Camera) {
        const colors = [];
        const poses = [];
        const width = [];
        const height = [];

        let ltcTexture1;
        let ltcTexture2;

        this.areaLights.forEach((light, index) => {
            const offset = index * 3;
            light.getRealColor().toRGBArray(colors, offset);

            camera.getModelViewMatrix(light, tempMatrix4);
            tempMatrix4.getTranslation(tempVector3);
            tempVector3.toArray(poses, offset);

            const quat = tempMatrix4.getRotation();
            tempMatrix4.fromQuat(quat);
            tempVector3.set(light.width * 0.5, 0, 0);
            tempVector3.transformMat4(tempMatrix4);
            tempVector3.toArray(width, offset);

            tempVector3.set(0.0, light.height * 0.5, 0.0);
            tempVector3.transformMat4(tempMatrix4);
            tempVector3.toArray(height, offset);

            ltcTexture1 = light.ltcTexture1;
            ltcTexture2 = light.ltcTexture2;
        });

        const result = {
            colors: new Float32Array(colors),
            poses: new Float32Array(poses),
            width: new Float32Array(width),
            height: new Float32Array(height),
            ltcTexture1,
            ltcTexture2
        };

        return result;
    }

    /**
     * 获取环境光信息
     * @returns
     */
    public getAmbientInfo() {
        tempFloat32Array[0] = tempFloat32Array[1] = tempFloat32Array[2] = 0;
        this.ambientLights.forEach((light) => {
            const realColor = light.getRealColor();
            tempFloat32Array[0] += realColor.r;
            tempFloat32Array[1] += realColor.g;
            tempFloat32Array[2] += realColor.b;
        });

        tempFloat32Array[0] = Math.min(1, tempFloat32Array[0]);
        tempFloat32Array[1] = Math.min(1, tempFloat32Array[1]);
        tempFloat32Array[2] = Math.min(1, tempFloat32Array[2]);
        return tempFloat32Array;
    }

  

    /**
     * 更新所有光源信息
     * @param   camera 摄像机
     */
    updateInfo(camera: Camera): void {
        const {
            lightInfo,
            ambientLights,
            directionalLights,
            pointLights,
            spotLights,
            areaLights
        } = this;

        lightInfo.AMBIENT_LIGHTS = ambientLights.length;
        lightInfo.POINT_LIGHTS = pointLights.length;
        lightInfo.DIRECTIONAL_LIGHTS = directionalLights.length;
        lightInfo.SPOT_LIGHTS = spotLights.length;
        lightInfo.AREA_LIGHTS = areaLights.length;

        const shadowFilter = light => !!light.shadow;
        lightInfo.SHADOW_POINT_LIGHTS = pointLights.filter(shadowFilter).length;
        lightInfo.SHADOW_SPOT_LIGHTS = spotLights.filter(shadowFilter).length;
        lightInfo.SHADOW_DIRECTIONAL_LIGHTS = directionalLights.filter(shadowFilter).length;

        lightInfo.uid = [
            lightInfo.AMBIENT_LIGHTS,
            lightInfo.POINT_LIGHTS,
            lightInfo.SHADOW_POINT_LIGHTS,
            lightInfo.DIRECTIONAL_LIGHTS,
            lightInfo.SHADOW_DIRECTIONAL_LIGHTS,
            lightInfo.SPOT_LIGHTS,
            lightInfo.SHADOW_SPOT_LIGHTS,
            lightInfo.AREA_LIGHTS
        ].join('_');

        this.directionalInfo = this.getDirectionalInfo(camera);
        this.pointInfo = this.getPointInfo(camera);
        this.spotInfo = this.getSpotInfo(camera);
        this.areaInfo = this.getAreaInfo(camera);
        this.ambientInfo = this.getAmbientInfo();
    }

    /**
     * 获取光源信息
     * @returns
     */
    public getInfo() : iLightInfo {
        return this.lightInfo;
    }

    /**
     * 重置所有光源
     */
    public reset() {
        this.ambientLights.length = 0;
        this.directionalLights.length = 0;
        this.pointLights.length = 0;
        this.spotLights.length = 0;
        this.areaLights.length = 0;
    }
}

export default LightManager;
