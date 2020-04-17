import { Shader } from "./Shader";

export class FboTestShader extends Shader {

    public constructor() {
        super("fbotest");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }


    private getVertexSource(): string {

        return `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main() {
    gl_Position =  vec4(a_position.x,  a_position.y, 0.0, 1.0);
    v_texCoord = a_texCoord;
}`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;
uniform sampler2D screenTexture;
varying vec2 v_texCoord;
void main() {
    // gl_FragColor = texture2D(screenTexture, v_texCoord);

    // 取反色效果
   // gl_FragColor = vec4(vec3(1.0 - texture2D(screenTexture, v_texCoord)), 1.0);

    // 灰度效果1
    // vec4 color = texture2D(screenTexture, v_texCoord);
    // float average = (color.r + color.g + color.b) / 3.0;
    // gl_FragColor = vec4(average, average, average, 1.0);

    // 灰度效果2
    vec4 color = texture2D(screenTexture, v_texCoord);
    float average =  0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
    gl_FragColor = vec4(average, average, average, 1.0);
}
`;
    }
}