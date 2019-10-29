import { Shader } from "./Shader";

export class GemometryShader extends Shader {

    public constructor() {
        super("geometry");

        this.load(this.getVertexSource(), this.getFragmentSource());
    }


    private getVertexSource(): string {

        return `
attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_view;
uniform mat4 u_model;
uniform mat4 u_projection;
varying vec3 v_fragPosition;
varying vec3 v_normal;
void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_fragPosition = vec3(u_model * vec4(a_position, 1.0));
    v_normal = a_normal;

    // 法线矩阵被定义为「模型矩阵左上角的逆矩阵的转置矩阵 TODO 应该提前通过cpu计算好，这个在着色器里也很消耗
    // Normal = mat3(transpose(inverse(model))) * aNormal;
}`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;
struct Material{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};
uniform vec3 u_lightPos;
uniform vec3 u_viewPos;
uniform vec3 u_lightColor;
uniform Material u_material;
varying vec3 v_normal;
varying vec3 v_fragPosition;
void main() {

    // 环境光
    vec3 ambient = u_lightColor * u_material.ambient;

    // 漫反射
    vec3 norm = normalize(v_normal);
    vec3 lightDir = normalize(u_lightPos - v_fragPosition);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = u_lightColor * (diff * u_material.ambient);

    // 镜面光
    vec3 viewDir = normalize(u_viewPos - v_fragPosition);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
    vec3 specular = u_lightColor * (spec * u_material.specular);

    // 叠加
    vec3 result = ambient + diffuse + specular;
    gl_FragColor = vec4(result, 1.0);
}
`;
    }
}