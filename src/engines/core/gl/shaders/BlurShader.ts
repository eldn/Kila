import { Shader } from "./Shader";

export class BlurShader extends Shader {

    public constructor() {
        super("blur");

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

const float offset = 1.0 / 300.0; 
void main() {
    // gl_FragColor = texture2D(screenTexture, v_texCoord);

    vec2 offsets[9];
    offsets[0] =  vec2(-offset, offset);  // top-left
    offsets[1] = vec2(0.0,    offset);  // top-center
    offsets[2] = vec2(offset,  offset);  // top-right
    offsets[3] = vec2(-offset, 0.0);    // center-left
    offsets[4] = vec2(0.0,    0.0);    // center-center
    offsets[5] = vec2(offset,  0.0);    // center-right
    offsets[6] = vec2(-offset, -offset); // bottom-left
    offsets[7] = vec2(0.0,    -offset); // bottom-center
    offsets[8] = vec2(offset,  -offset);  // bottom-right
    

    float kernel[9];
    kernel[0] =  1.0 / 16.0; kernel[1] =  2.0 / 16.0; kernel[2] =   1.0 / 16.0;
    kernel[3] =  2.0 / 16.0;  kernel[4] =  4.0 / 16.0; kernel[5] =  2.0 / 16.0;
    kernel[6] =  1.0 / 16.0; kernel[7] =  2.0 / 16.0; kernel[8] =  1.0 / 16.0;
    
    
    vec3 sampleTex[9];
    for(int i = 0; i < 9; i++)
    {
        sampleTex[i] = vec3(texture2D(screenTexture, v_texCoord.st + offsets[i]));
    }
    vec3 col;
    for(int i = 0; i < 9; i++)
        col += sampleTex[i] * kernel[i];

    gl_FragColor = vec4(col, 1.0);

}
`;
    }
}