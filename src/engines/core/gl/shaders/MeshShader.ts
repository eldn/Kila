import { Shader } from "./Shader";

export class MeshShader extends Shader {

    public constructor() {
        super("mesh");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }


    private getVertexSource(): string {

        return `
attribute vec3 a_position;
uniform mat4 u_view;
uniform mat4 u_model;
uniform mat4 u_projection;
void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
}`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;
uniform vec4 u_tint;
void main() {
    gl_FragColor = u_tint;
}
`;
    }
}