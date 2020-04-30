import { Geometry } from "./Geometry";
import { Utils } from "../../math/Utils";

export class MorphGeometry extends Geometry{

    isStatic: boolean = false;

   /**
     * morph animation weights
     * @type {Array.<number>}
     */
    weights: Array<number> = [];

    /**
     * like:
     * {
     *     vertices: [[], []],
     *     normals: [[], []],
     *     tangents: [[], []]
     * }
     * @default null
     * @type {Object}
     */
    targets: Object = null;

    /**
     * @constructs
     * @param {object} [params] 创建对象的属性参数。可包含此类的所有属性。
     */
    constructor(params ?: any) {
        super(params);
        this.weights = this.weights || [];
    }
    

    private _originalMorphIndices : any;

    update(weights, originalWeightIndices) {
        this.weights = weights;
        this._originalMorphIndices = originalWeightIndices;
    }

    clone() {
        return Geometry.prototype.clone.call(this, {
            targets: this.targets,
            weights: this.weights
        });
    }

    private _maxMorphTargetCount : number;

    getRenderOption(opt : any = {}) {
        super.getRenderOption.call(this, opt);

        if (this.targets) {
            if (!this._maxMorphTargetCount) {
                this._maxMorphTargetCount = Math.floor(8 / Object.keys(this.targets).length);
            }
           Utils.each(this.targets, (list, name) => {
                opt.MORPH_TARGET_COUNT = Math.min(list.length, this._maxMorphTargetCount);
                if (name === 'vertices') {
                    opt.MORPH_HAS_POSITION = 1;
                } else if (name === 'normals') {
                    opt.MORPH_HAS_NORMAL = 1;
                } else if (name === 'tangents') {
                    opt.MORPH_HAS_TANGENT = 1;
                }
            });
        }
        return opt;
    }

    getShaderKey() {
        if (this._shaderKey === undefined) {
            this._shaderKey = 'geometry';
            this._shaderKey += `_id_${this.id}`;
        }

        return this._shaderKey;
    }


}