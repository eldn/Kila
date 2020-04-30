import { Mesh } from "./Mesh";
import { GameObject } from "../world/GameObject";
import { Matrix4 } from "../math/Matrix4";


const tempMatrix1 = new Matrix4();
const tempMatrix2 = new Matrix4();

export class SkinedMesh extends Mesh{


    _rootNode: any =  null;

     /**
     * 这个骨骼Mesh的根节点，改变后会自动根据 jointNames 来更新 jointNodeList
     * @default null
     * @type {Node}
     */
    get rootNode() {
        return this._rootNode;
    }

    set rootNode(node) {
        this._rootNode = node;
        this.initJointNodeList();
    }

    /**
     * 骨骼节点数组
     * @default null
     * @type {Node[]}
     */
    jointNodeList: Array<GameObject> = null;


    /**
     * 是否支持 Instanced
     * @default false
     * @type {boolean}
     */
    useInstanced: boolean = false;


     /**
     * 骨骼矩阵DataTexture
     * @default null
     * @type {DataTexture}
     */
    jointMatTexture: null;


     /**
     * 是否开启视锥体裁剪
     * @default false
     * @type {Boolean}
     */
    frustumTest:  boolean = false;

     /**
     * 当前骨骼Mesh关联的骨骼名字列表
     * @default []
     * @type {string[]}
     */
     jointNames : Array<string> = [];

     /**
     * 当前骨骼Mesh的 inverseBindMatrices
     * @default []
     * @type {Array}
     */
    inverseBindMatrices : Array<string>;

     /**
     * @constructs
     * @param {object} params 初始化参数，所有params都会复制到实例上
     */
    constructor() {
        super();

        this.jointNames = [];

        this.inverseBindMatrices = [];
    }

    initJointNodeList() {
        if (!this._rootNode) {
            return;
        }
        const jointMap = {};
        this._rootNode.traverse((child) => {
            if ('jointName' in child) {
                jointMap[child.jointName] = child;
            }
        });
        this.jointNodeList = [];
        this.jointNames.forEach((name) => {
            this.jointNodeList.push(jointMap[name]);
        });
    }


    jointMat : Float32Array;

    /**
     * 获取每个骨骼对应的矩阵数组
     * @return {Float32Array} 返回矩阵数组
     */
    getJointMat() {
      
    }

    

}