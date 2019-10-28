import { Shader } from "./Shader";

export class GemometryShader extends Shader {

    public constructor() {
        super("geometry");

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
void main() {
    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
`;
    }
}