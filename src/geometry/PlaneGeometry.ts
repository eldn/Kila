import { Geometry } from "./Geometry";
import { GeometryData } from "./GeometryData";


export class PlaneGeometry extends Geometry{


    public getClassName() : string{
        return "PlaneGeometry";
    }


    public width : number = 1;
    public height : number = 1;

     /**
     * 水平分割面的数量
     */
    public widthSegments: number = 1;

    
     /**
     * 垂直分割面的数量
     */
    public heightSegments: number = 1;


    
    constructor() {
        super();
        this.build();
    }

    public build() : void {
        const {
            widthSegments,
            heightSegments
        } = this;
        const count = (widthSegments + 1) * (heightSegments + 1);
        const diffW = this.width / widthSegments;
        const diffH = this.height / heightSegments;

        const vertices = new Float32Array(count * 3);
        const normals = new Float32Array(count * 3);
        const uvs = new Float32Array(count * 2);
        const indices = new Uint16Array(widthSegments * heightSegments * 6);

        let indicesIdx = 0;

        for (let h = 0; h <= heightSegments; h++) {
            for (let w = 0; w <= widthSegments; w++) {
                let idx = h * (widthSegments + 1) + w;
                vertices[idx * 3] = w * diffW - this.width / 2;
                vertices[idx * 3 + 1] = this.height / 2 - h * diffH;
                normals[idx * 3] = 0;
                normals[idx * 3 + 1] = 0;
                normals[idx * 3 + 2] = 1;
                uvs[idx * 2] = w / widthSegments;
                uvs[idx * 2 + 1] = 1 - h / heightSegments;

                if (h < heightSegments && w < widthSegments) {
                    let lb = (h + 1) * (widthSegments + 1) + w;
                    indices[indicesIdx++] = idx;
                    indices[indicesIdx++] = lb;
                    indices[indicesIdx++] = lb + 1;
                    indices[indicesIdx++] = idx;
                    indices[indicesIdx++] = lb + 1;
                    indices[indicesIdx++] = idx + 1;
                }
            }
        }

        this.vertices = new GeometryData(vertices, 3);
        this.indices = new GeometryData(indices, 1);
        this.normals = new GeometryData(normals, 3);
        this.uvs = new GeometryData(uvs, 2);
    }


}