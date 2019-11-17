import { Shader } from "./Shader";

export class SkyBoxShader extends Shader {

    public constructor() {
        super("skybox");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }


    private getVertexSource(): string {

        return `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 view;
varying vec3 TexCoords;

void main() {
    vec4 pos = projection * view * vec4(position, 1.0); 
    gl_Position = pos.xyww;  
    TexCoords = position;
}
`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;

uniform samplerCube skybox;
varying vec3 TexCoords;
    
varying vec4 v_position;
void main() {
    gl_FragColor = textureCube(skybox, TexCoords);
}
`;
    }
}