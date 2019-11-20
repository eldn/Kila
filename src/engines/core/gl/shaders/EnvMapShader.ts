import { Shader } from "./Shader";

export class EvnMapShader extends Shader {

    public constructor() {
        super("envmap");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }


    private getVertexSource(): string {

        return `
attribute vec3 a_position;
attribute vec3 aNormal;

varying vec3 vNormal;
varying vec3 vPosition;

uniform mat4 u_view;
uniform mat4 u_model;
uniform mat4 u_projection;
uniform mat4 u_modelInverseTranspose;

void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);

    // 去掉平移和缩放
    vNormal = (u_modelInverseTranspose * vec4(aNormal, 0)).xyz;

    vPosition = vec3(u_model * vec4(a_position, 1.0));
}`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 u_viewPos;
uniform samplerCube uSkyBox;

void main() {
    vec3 I = normalize(vPosition - u_viewPos);
    vec3 R = reflect(I, normalize(vNormal));
    gl_FragColor = textureCube(uSkyBox, R);
}
`;
    }
}