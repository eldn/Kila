import { Shader } from "./Shader";

export class NoLightShader extends Shader {

    public constructor() {
        super("nolight");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }


    private getVertexSource(): string {

        return `
attribute vec3 a_position;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
uniform mat4 u_view;
uniform mat4 u_model;
uniform mat4 u_projection;

varying highp vec2 vTextureCoord;
void main() {
    vec3 test = aNormal;
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    vTextureCoord = aTextureCoord;
}`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;
    }
}