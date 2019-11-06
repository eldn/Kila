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
varying vec2 v_textcoord;
varying vec3 v_normal;
varying vec3 v_fragPosition;
void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_textcoord = a_textcoord;
    v_normal = a_normal;
    v_fragPosition = vec3(u_model * vec4(a_position, 1.0));
}`;
    }

    private getFragmentSource(): string {
        return `
precision mediump float;
struct Material{
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
};


// 平行光
struct DirLight {
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
}; 
uniform DirLight u_dirLight;

// 聚光灯
struct SpotLight{
    vec3 position;
    vec3 direction;
    float cutOff;
    float outerCutOff;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
uniform SpotLight u_spotLight;



// 点光源
struct PointLight {
    vec3 position;

    float constant;
    float linear;
    float quadratic;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
#define NR_POINT_LIGHTS 4
uniform PointLight u_pointLights[NR_POINT_LIGHTS];


uniform vec3 u_viewPos;
uniform Material u_material;
varying vec2 v_textcoord;
varying vec3 v_normal;
varying vec3 v_fragPosition;

// 计算平行光
vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);

    // 漫反射着色
    float diff = max(dot(normal, lightDir), 0.0);

    // 镜面光着色
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);

    // 合并结果
    vec3 ambient  = light.ambient  * vec3(texture2D(u_material.diffuse, v_textcoord));
    vec3 diffuse  = light.diffuse  * diff * vec3(texture2D(u_material.diffuse, v_textcoord));
    vec3 specular = light.specular * spec * vec3(texture2D(u_material.specular, v_textcoord));
    return (ambient + diffuse + specular);
}

// 计算点光源
vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);

    // 漫反射着色
    float diff = max(dot(normal, lightDir), 0.0);

    // 镜面光着色
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);

    // 衰减
    float distance    = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    

    // 合并结果
    vec3 ambient  = light.ambient  * vec3(texture2D(u_material.diffuse, v_textcoord));
    vec3 diffuse  = light.diffuse  * diff * vec3(texture2D(u_material.diffuse, v_textcoord));
    vec3 specular = light.specular * spec * vec3(texture2D(u_material.specular, v_textcoord));
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}

// 计算聚光灯
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    float theta     = dot(lightDir, normalize(-light.direction));
    float epsilon   = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0); 

    // 环境光
    vec3 ambient  = light.ambient  * vec3(texture2D(u_material.diffuse, v_textcoord));

    // 漫反射
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse  = light.diffuse  * diff * vec3(texture2D(u_material.diffuse, v_textcoord));

    // 镜面光
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
    vec3 specular = light.specular * spec * vec3(texture2D(u_material.specular, v_textcoord));

    // 合并结果
    return (ambient + diffuse + specular) * intensity;
}

void main() {

    vec3 viewDir = normalize(u_viewPos - v_fragPosition);
    vec3 norm = normalize(v_normal);

    // 平行光
    vec3 result = CalcDirLight(u_dirLight, norm, viewDir);

    // 点光源
    for(int i = 0; i < NR_POINT_LIGHTS; i++){
        result += CalcPointLight(u_pointLights[i], norm, v_fragPosition, viewDir); 
    }

    // 聚光灯
    result += CalcSpotLight(u_spotLight, norm, v_fragPosition, viewDir);

    gl_FragColor = vec4(result, 1.0);

}
`;
    }
}