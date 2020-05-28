

/**
 * 渲染信息
 * @class
 */
export class RenderInfo{

    /**
     * @constructs
     */
    constructor() {
        this.reset();
    }

    getClassName() : string{
        return "RenderInfo";
    }

    /**
     * 当前面数
     * @type {Number}
     * @private
     */
    private _currentFaceCount : number = 0;

    /**
     * 增加面数
     * @param {number} num
     */
    addFaceCount(num: number) {
        this._currentFaceCount += num;
    }

    /**
     * 当前绘图数
     * @private
     * @type {Number}
     */
    private _currentDrawCount : number = 0;

    /**
     * 增加绘图数
     * @param {Number} num
     */
    addDrawCount(num) {
        this._currentDrawCount += num;
    }

    /**
     * 面数
     * @type {Number}
     * @readOnly
     */
    faceCount :  number = 0;

    /**
     * 绘图数
     * @type {Number}
     * @readOnly
     */
    drawCount : number = 0;

    /**
     * 重置信息
     */
    reset() {
        
        this.faceCount = Math.floor(this._currentFaceCount);

        
        this.drawCount = Math.floor(this._currentDrawCount);

        
        this._currentFaceCount = 0;

        
        this._currentDrawCount = 0;
    }
}

export default RenderInfo;
