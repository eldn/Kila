import { gl } from "../GLUtilities";

export abstract class Shader {

    private _name: string;
    private _program: WebGLProgram;
    private _attributes: { [name: string]: number } = {};
    private _uniforms: { [name: string]: WebGLUniformLocation } = {};

  
    public constructor(name: string) {
        this._name = name;
    }

   
    public get name(): string {
        return this._name;
    }

    public use(): void {
        gl.useProgram(this._program);
    }

    public getAttributeLocation(name: string): number {
        if (this._attributes[name] === undefined) {
            throw new Error(`Unable to find attribute named '${name}' in shader named '${this._name}'`);
        }

        return this._attributes[name];
    }

    
    public getUniformLocation(name: string): WebGLUniformLocation {
        if (this._uniforms[name] === undefined) {
            throw new Error(`Unable to find uniform named '${name}' in shader named '${this._name}'`);
        }

        return this._uniforms[name];
    }

    public setUniformMatrix4fv(name : string, transpose: GLboolean, value : Float32Array) : void{
        let location = this.getUniformLocation(name);
        gl.uniformMatrix4fv(location, transpose, value);
    }

    public setUniform4fv(name : string, value : Float32Array) : void{
        let location = this.getUniformLocation(name);
        gl.uniform4fv(location, value);
    }

    public setUniform1i(name : string, value : number) : void{
        let location = this.getUniformLocation(name);
        gl.uniform1i(location, value);
    }
  
    protected load(vertexSource: string, fragmentSource: string): void {
        let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

        this.createProgram(vertexShader, fragmentShader);

        this.detectAttributes();
        this.detectUniforms();
    }

    private loadShader(source: string, shaderType: number): WebGLShader {
        let shader: WebGLShader = gl.createShader(shaderType);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let error = gl.getShaderInfoLog(shader).trim();
        if (error !== "") {
            throw new Error("Error compiling shader '" + this._name + "': " + error);
        }

        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        this._program = gl.createProgram();

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);

        let error = gl.getProgramInfoLog(this._program).trim();
        if (error !== "") {
            throw new Error("Error linking shader '" + this._name + "': " + error);
        }
    }

    private detectAttributes(): void {
        let attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; ++i) {
            let info: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
            if (!info) {
                break;
            }

            this._attributes[info.name] = gl.getAttribLocation(this._program, info.name);
        }
    }

    private detectUniforms(): void {
        let uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; ++i) {
            let info: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
            if (!info) {
                break;
            }

            this._uniforms[info.name] = gl.getUniformLocation(this._program, info.name);
        }
    }
}