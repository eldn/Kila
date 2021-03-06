import { Geometry } from "./Geometry";
import { log } from "../utils/Log";
import { GeometryData } from "./GeometryData";


/**
 * 长方体几何体
 */
export class BoxGeometry extends Geometry {
    /**
     * box的宽度
     */
    private _width: number = 1;

    /**
     * box的高度
     */
    private _height: number = 1;

    /**
     * box的深度
     */
    private _depth: number = 1;

    /**
     * 水平分割面的数量
     */
    private _widthSegments: number = 1;

    /**
     * 垂直分割面的数量
     */
    private _heightSegments: number = 1;

    /**
     * 深度分割面的数量
     */
    private _depthSegments: number = 1;

    
    constructor() {
        super();
        if (this.isSegments()) {
            this.buildWithSegments();
        } else {
            this.build();
        }
    }

    public getClassName() : string{
        return "BoxGeometry";
    }

    public buildWithSegments() : void {
        const {
            _width: width,
            _height: height,
            _depth: depth,
            _widthSegments: widthSegments,
            _heightSegments: heightSegments,
            _depthSegments: depthSegments
        } = this;

        const xVertexCount = (heightSegments + 1) * (depthSegments + 1);
        const yVertexCount = (widthSegments + 1) * (depthSegments + 1);
        const zVertexCount = (widthSegments + 1) * (heightSegments + 1);
        const xIndexCount = heightSegments * depthSegments * 6;
        const yIndexCount = widthSegments * depthSegments * 6;
        const zIndexCount = widthSegments * heightSegments * 6;

        const verticesCount = (xVertexCount + yVertexCount + zVertexCount) * 2;
        const vertices = new Float32Array(verticesCount * 3);
        const normals = new Float32Array(verticesCount * 3);
        const uvs = new Float32Array(verticesCount * 2);
        const indices = new Uint16Array((xIndexCount + yIndexCount + zIndexCount) * 2);

        this.vertices = new GeometryData(vertices, 3);
        this.normals = new GeometryData(normals, 3);
        this.uvs = new GeometryData(uvs, 2);
        this.indices = new GeometryData(indices, 1);

        let idxInfo = [0, 0];
        // x right
        this.buildPlane(idxInfo, 2, 1, 0, -1, 1, depth, height, width / 2, depthSegments, heightSegments);
        // -x left
        this.buildPlane(idxInfo, 2, 1, 0, 1, 1, depth, height, -width / 2, depthSegments, heightSegments);
        // y top
        this.buildPlane(idxInfo, 0, 2, 1, 1, -1, width, depth, height / 2, widthSegments, depthSegments);
        // -y bottom
        this.buildPlane(idxInfo, 0, 2, 1, 1, 1, width, depth, -height / 2, widthSegments, depthSegments);
        // z front
        this.buildPlane(idxInfo, 0, 1, 2, 1, 1, width, height, depth / 2, widthSegments, heightSegments);
        // -z back
        this.buildPlane(idxInfo, 0, 1, 2, -1, 1, width, height, -depth / 2, widthSegments, heightSegments);
    }

    public buildPlane(idxInfo : Array<number>, u : number, v : number, w : number, uDir : number, vDir : number, uLength : number, vLength : number, wValue : number, uSegments : number, vSegments : number) : void{
        const uDiff = uLength / uSegments;
        const vDiff = vLength / vSegments;
        const uHalf = uLength / 2;
        const vHalf = vLength / 2;

        let idx = idxInfo[0];
        let currentIndicesIdx = idxInfo[1];

        const vertices = this.vertices.data;
        const normals = this.normals.data;
        const uvs = this.uvs.data;
        const indices = this.indices.data;

        for (let vi = 0; vi <= vSegments; vi++) {
            let vValue = (vi * vDiff - vHalf) * vDir;
            for (let ui = 0; ui <= uSegments; ui++) {
                vertices[idx * 3 + u] = (ui * uDiff - uHalf) * uDir;
                vertices[idx * 3 + v] = vValue;
                vertices[idx * 3 + w] = wValue;
                normals[idx * 3 + u] = 0;
                normals[idx * 3 + v] = 0;
                normals[idx * 3 + w] = wValue < 0 ? -1 : 1;
                uvs[idx * 2] = ui / uSegments;
                uvs[idx * 2 + 1] = 1 - vi / vSegments;

                if (ui < uSegments && vi < vSegments) {
                    let lb = idxInfo[0] + (vi + 1) * (uSegments + 1) + ui;
                    indices[currentIndicesIdx++] = lb;
                    indices[currentIndicesIdx++] = idx;
                    indices[currentIndicesIdx++] = lb + 1;

                    indices[currentIndicesIdx++] = lb + 1;
                    indices[currentIndicesIdx++] = idx;
                    indices[currentIndicesIdx++] = idx + 1;
                }
                idx++;
            }
        }

        idxInfo[0] = idx;
        idxInfo[1] = currentIndicesIdx;
    }

    public build() : void {
        const vertices = new Float32Array(72);
        const indices = new Uint16Array(36);

        this.vertices = new GeometryData(vertices, 3);
        this.indices = new GeometryData(indices, 1);

        const halfWidth = this._width / 2;
        const halfHeight = this._height / 2;
        const halfDepth = this._depth / 2;

        const p1 = [-halfWidth, -halfHeight, -halfDepth];
        const p2 = [halfWidth, -halfHeight, -halfDepth];
        const p3 = [halfWidth, halfHeight, -halfDepth];
        const p4 = [-halfWidth, halfHeight, -halfDepth];
        const p5 = [-halfWidth, -halfHeight, halfDepth];
        const p6 = [halfWidth, -halfHeight, halfDepth];
        const p7 = [halfWidth, halfHeight, halfDepth];
        const p8 = [-halfWidth, halfHeight, halfDepth];

        this.addRect(p6, p2, p3, p7); // right
        this.addRect(p1, p5, p8, p4); // left
        this.addRect(p8, p7, p3, p4); // top
        this.addRect(p1, p2, p6, p5); // bottom
        this.addRect(p5, p6, p7, p8); // front
        this.addRect(p2, p1, p4, p3); // back
    }

    public isSegments() : boolean {
        return this._widthSegments > 1 || this._heightSegments > 1 || this._depthSegments > 1;
    }
    
    /**
     * 设置朝前面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
     * @param  uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
     */
    public setFrontUV(uv : number[][]) : void {
        if (this.isSegments()) {
            log.warn('segmented BoxGeometry dont support setFrontUV!');
            return;
        }
        this.setVertexUV(32, uv);
    }

    /**
     * 设置右侧面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
     * @param  uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
     */
    public setRightUV(uv: number[][]) : void{
        if (this.isSegments()) {
            log.warn('segmented BoxGeometry dont support setRightUV!');
            return;
        }
        this.setVertexUV(0, uv);
    }

    /**
     * 设置朝后面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
     * @param uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
     */
    public setBackUV(uv : number[][]) : void {
        if (this.isSegments()) {
            log.warn('segmented BoxGeometry dont support setBackUV!');
            return;
        }
        this.setVertexUV(40, uv);
    }

    /**
     * 设置左侧面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
     * @param uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
     */
    setLeftUV(uv: number[][]) : void {
        if (this.isSegments()) {
            log.warn('segmented BoxGeometry dont support setLeftUV!');
            return;
        }
        this.setVertexUV(8, uv);
    }

    /**
     * 设置顶部面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
     * @param  uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
     */
    setTopUV(uv: number[][]) : void {
        if (this.isSegments()) {
            log.warn('segmented BoxGeometry dont support setTopUV!');
            return;
        }
        this.setVertexUV(16, uv);
    }

    /**
     * 设置底部面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
     * @param  uv uv数据，如 [[0, 1], [1, 1], [1, 0], [0, 0]]
     */
    setBottomUV(uv: number[][]) : void {
        if (this.isSegments()) {
            log.warn('segmented BoxGeometry dont support setBottomUV!');
            return;
        }
        this.setVertexUV(24, uv);
    }

    /**
     * 设置所有面的uv，不支持设置带有 widthSegments heightSegments depthSegments 的实例
     * @param {number[][][]} uv uv数据，如
     * [<br>
     *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
     *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
     *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
     *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
     *     [[0, 1], [1, 1], [1, 0], [0, 0]],<br>
     *     [[0, 1], [1, 1], [1, 0], [0, 0]]<br>
     * ]
     */
    setAllRectUV(uv: number[][]) : BoxGeometry {
        if (this.isSegments()) {
            log.warn('segmented BoxGeometry dont support setAllRectUV!');
            return null;
        }
        for (let i = 0; i < 6; i++) {
            this.setVertexUV(i * 8, uv);
        }

        return this;
    }
 
}

export default BoxGeometry;
