import { Shader } from "./Shader";

export class MeshShader extends Shader {

    public constructor() {
        super("mesh");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }


    private getVertexSource(): string {

        return `
attribute vec3 a_position;
attribute vec2 a_textcoord;
attribute vec4 a_color;
attribute vec3 a_normal;
uniform mat4 u_view;
uniform mat4 u_model;
uniform mat4 u_projection;
varying vec4 v_color;
varying vec2 v_textcoord;
varying vec3 v_normal;
void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_color = a_color;
    v_textcoord = a_textcoord;
    v_normal = a_normal;
}`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;
uniform vec4 u_tint;
uniform sampler2D u_diffuse;
varying vec4 v_color;
varying vec2 v_textcoord;
varying vec3 v_normal;
void main() {
    gl_FragColor = u_tint * texture2D(u_diffuse, v_textcoord);
}
`;
    }
}