

/**
 * 渲染信息
 */
export class RenderInfo{

  
    constructor() {
        this.reset();
    }

    public getClassName() : string{
        return "RenderInfo";
    }

    /**
     * 当前面数
     */
    private _currentFaceCount : number = 0;

    /**
     * 增加面数
     * @param  num
     */
    public addFaceCount(num: number) : void {
        this._currentFaceCount += num;
    }

    /**
     * 当前绘图数
     */
    private _currentDrawCount : number = 0;

    /**
     * 增加绘图数
     * @param  num
     */
    public addDrawCount(num : number) : void{
        this._currentDrawCount += num;
    }

    /**
     * 面数
     */
    public faceCount :  number = 0;

    /**
     * 绘图数
     */
    public drawCount : number = 0;

    /**
     * 重置信息
     */
    public reset() : void {
        this.faceCount = Math.floor(this._currentFaceCount);
        this.drawCount = Math.floor(this._currentDrawCount);
        this._currentFaceCount = 0;
        this._currentDrawCount = 0;
    }
}

export default RenderInfo;
