
export let gl: WebGLRenderingContext;

export class GLUtilities {


    public static initialize(elementId?: string): HTMLCanvasElement {
        let canvas: HTMLCanvasElement;

        if (elementId !== undefined) {
            canvas = document.getElementById(elementId) as HTMLCanvasElement;
            if (canvas === undefined) {
                throw new Error("Cannot find a canvas element named:" + elementId);
            }
        } else {
            canvas = document.createElement("canvas") as HTMLCanvasElement;
            document.body.appendChild(canvas);
        }

        gl = canvas.getContext("webgl");
        if (gl === undefined || gl === null) {
            gl = canvas.getContext("experimental-webgl") as WebGLRenderingContext;
            if (gl === undefined || gl === null) {
                throw new Error("Unable to initialize WebGL!");
            }
        }

        return canvas;
    }
}