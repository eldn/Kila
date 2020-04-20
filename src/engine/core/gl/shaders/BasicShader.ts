import { Shader } from "./Shader";

export class BasicShader extends Shader {

    public constructor() {
        super("basic");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }


    private getVertexSource(): string {

        return `
attribute vec4 a_position;
attribute vec2 a_texCoord;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
varying vec2 v_texCoord;
void main() {
    gl_Position = u_projection * u_model *  u_view * a_position;
    v_texCoord = a_texCoord;
}`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;
uniform sampler2D u_diffuse;
varying vec2 v_texCoord;
void main() {
    gl_FragColor = texture2D(u_diffuse, v_texCoord);
}
`;
    }
}