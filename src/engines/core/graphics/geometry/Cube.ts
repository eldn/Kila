import { GemometryShader } from "../../gl/shaders/GeometryShader";
import { GLBuffer } from "../../gl/GLBuffer";
import { Color } from "../Color";
import { gl } from "../../gl/GLUtilities";
import { AttributeInfo } from "../../gl/AttributeInfo";
import { Shader } from "../../gl/shaders/Shader";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { Level } from "../../world/Level";
import { LevelManager } from "../../world/LevelManager";
import { TEntity } from "../../world/Entity";
import { Vector3 } from "../../math/Vector3";
import { PerspectiveCamera } from "../../world/cameras/PerspectiveCamera";

const v3_a: Vector3 = new Vector3();

class iLightProperty {
    position: Vector3 = new Vector3()
    ambient: Vector3 = new Vector3();
    diffuse: Vector3 = new Vector3();
    specular: Vector3 = new Vector3();

    constructor(position: Vector3, ambient: Vector3, diffuse: Vector3, specular: Vector3) {
        this.position.copyFrom(position);
        this.ambient.copyFrom(ambient);
        this.diffuse.copyFrom(diffuse);
        this.specular.copyFrom(specular);
    }
}

export class Cube {

    private _name: string;;
    private _vertextBuffer: GLBuffer;
    private _shader: GemometryShader;
    public get shader(): GemometryShader {
        return this._shader;
    }
    public set shader(value: GemometryShader) {
        this._shader = value;
    }

    private _color: Color;

    private _lightProperty: iLightProperty;

    constructor(name: string, color: Color) {
        this._name = name;
        this._color = color;
        this._vertextBuffer = new GLBuffer(gl.FLOAT, gl.ARRAY_BUFFER, gl.TRIANGLES);
        this._shader = new GemometryShader();
    }

    public get name(): string {
        return this._name;
    }


    public load(): void {



        let vertices: Array<number> = [
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            -0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,

            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,

            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,
            -0.5, 0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, 0.5, -1.0, 0.0, 0.0,
            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,

            0.5, 0.5, 0.5, 1.0, 0.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, 0.5, 1.0, 0.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0, 0.0,

            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            -0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,

            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0
        ];

        // 顶点数据
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.size = 3;
        this._vertextBuffer.addAttributeLocation(positionAttribute);

        // 法线数据
        let normalAttribute = new AttributeInfo();
        normalAttribute.location = 1;
        normalAttribute.size = 3;
        this._vertextBuffer.addAttributeLocation(normalAttribute);

        this._vertextBuffer.setData(vertices);
        this._vertextBuffer.upload();
        this._vertextBuffer.unbind();
    }


    public draw(shader: Shader, model: Matrix4x4, projection: Matrix4x4, viewMatrix: Matrix4x4): void {

        this._shader.use();

        let curLevel: Level = LevelManager.activeLevel;

        if (curLevel) {
            let light: TEntity = curLevel.sceneGraph.getEntityByName('testLight');
            if (light) {
                let lightWorldPos: Vector3 = light.getWorldPosition();

                if (!this._lightProperty) {
                    this._lightProperty = new iLightProperty(lightWorldPos, new Vector3(0.2, 0.2, 0.2), new Vector3(0.5, 0.5, 0.5), new Vector3(1.0, 1.0, 1.0));
                }

                // 设置光的位置和属性
                this._shader.setUniform3f("u_light.position", this._lightProperty.position.x, this._lightProperty.position.y, this._lightProperty.position.z);
                this._shader.setUniform3f("u_light.ambient", this._lightProperty.ambient.x, this._lightProperty.ambient.y, this._lightProperty.ambient.z);

                // 将光照调暗了一些以搭配场景
                this._shader.setUniform3f("u_light.diffuse", this._lightProperty.diffuse.x, this._lightProperty.diffuse.y, this._lightProperty.diffuse.z);
                this._shader.setUniform3f("u_light.specular", this._lightProperty.specular.x, this._lightProperty.specular.y, this._lightProperty.specular.z);
            }
        }

        let activeCamera: PerspectiveCamera = LevelManager.activeLevelActiveCamera as PerspectiveCamera;
        if (activeCamera) {
            let viewPos: Vector3 = activeCamera.getWorldPosition();
            this._shader.setUniform3f("u_viewPos", viewPos.x, viewPos.y, viewPos.z);
        }

        this._shader.setUniformMatrix4fv("u_projection", false, projection.toFloat32Array());
        this._shader.setUniformMatrix4fv("u_view", false, viewMatrix.toFloat32Array());
        this._shader.setUniformMatrix4fv("u_model", false, model.toFloat32Array());

        // 设置材质
        this._shader.setUniform3f("u_material.ambient", 1.0, 0.5, 0.31);
        this._shader.setUniform3f("u_material.diffuse", 1.0, 0.5, 0.31);
        this._shader.setUniform3f("u_material.specular", 0.5, 0.5, 0.5);
        this._shader.setUniform1f("u_material.shininess", 32.0);



        this._vertextBuffer.bind();
        this._vertextBuffer.draw();
    }


    private scale1: Vector3 = new Vector3(0.5, 0.5, 0.5);
    private scale2: Vector3 = new Vector3(0.2, 0.2, 0.2);
    private lightColor: Vector3 = new Vector3();
    update(dt: number): void {

        dt /= 10;

        // 动态改变光的属性
        // if (this._lightProperty) {
        //     this.lightColor.x = Math.sin(dt * 2.0);
        //     this.lightColor.y = Math.sin(dt * 0.7);
        //     this.lightColor.z = Math.sin(dt * 1.3);

        //     // 降低影响
        //     let diffuseColor: Vector3 = Vector3.multiply(v3_a, this.lightColor, this.scale1);
        //     // 很低的影响
        //     let ambientColor: Vector3 = Vector3.multiply(v3_a, diffuseColor, this.scale2);

        //     this._lightProperty.ambient.copyFrom(ambientColor);
        //     this._lightProperty.diffuse.copyFrom(diffuseColor);
        // }
    }
}