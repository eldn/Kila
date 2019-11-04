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
struct Light{
    vec3 position;
    vec3 direction;
    float cutOff;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    // float constant;
    // float linear;
    // float quadratic;
};
uniform Light u_light;
uniform vec3 u_viewPos;
uniform Material u_material;
varying vec2 v_textcoord;
varying vec3 v_normal;
varying vec3 v_fragPosition;
void main() {

   

    // 点光源
    vec3 lightDir = normalize(u_light.position - v_fragPosition);
    float theta = dot(lightDir, normalize(-u_light.direction));

    if(theta > u_light.cutOff) 
    {       
        // 执行光照计算

        // 环境光
        vec3 ambient = u_light.ambient * vec3(texture2D(u_material.diffuse, v_textcoord));

        // 漫反射
        vec3 norm = normalize(v_normal);
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = u_light.diffuse * diff * vec3(texture2D(u_material.diffuse, v_textcoord));

        // 镜面光
        vec3 viewDir = normalize(u_viewPos - v_fragPosition);
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
        vec3 specular = u_light.specular * spec * vec3(texture2D(u_material.specular, v_textcoord));

        // 衰减
        //float distance = length(u_light.position - v_fragPosition);
        //float attenuation = 1.0 / (u_light.constant + u_light.linear * distance + u_light.quadratic * (distance * distance));
    
    
        // 叠加
        // vec3 result = (ambient + diffuse + specular) * attenuation;
        vec3 result = ambient + diffuse + specular;
        gl_FragColor = vec4(result, 1.0);
    }
    else 
    {
        // 否则，使用环境光，让场景在聚光之外时不至于完全黑暗
        gl_FragColor = vec4(u_light.ambient * vec3(texture2D(u_material.diffuse, v_textcoord)), 1.0);
    }

    

   

  
}
`;
    }
}