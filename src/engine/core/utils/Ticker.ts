export class Ticker {

    /**
     * @private
     */
    private static callBackList: Function[] = [];

    /**
     * @private
     */
    private static thisObjectList: any[] = [];


    /**
    * @private
    */
    public static startTick(callBack: (timeStamp: number) => void, thisObject: any): void {
        let index = this.getTickIndex(callBack, thisObject);
        if (index != -1) {
            return;
        }
        this.concatTick();
        this.callBackList.push(callBack);
        this.thisObjectList.push(thisObject);
    }


    /**
     * @private
     */
    public static stopTick(callBack: (timeStamp: number) => void, thisObject: any): void {
        let index = this.getTickIndex(callBack, thisObject);
        if (index == -1) {
            return;
        }
        this.concatTick();
        this.callBackList.splice(index, 1);
        this.thisObjectList.splice(index, 1);
    }

    /**
     * @private
     */
    private static getTickIndex(callBack: Function, thisObject: any): number {
        let callBackList = this.callBackList;
        let thisObjectList = this.thisObjectList;
        for (let i = callBackList.length - 1; i >= 0; i--) {
            if (callBackList[i] == callBack &&
                thisObjectList[i] == thisObject) {//这里不能用===，因为有可能传入undefined和null.
                return i;
            }
        }
        return -1;
    }

    /**
     * @private
     *
     */
    private static concatTick(): void {
        this.callBackList = this.callBackList.concat();
        this.thisObjectList = this.thisObjectList.concat();
    }


     /**
     * @private
     * 执行一次刷新
     */
    public static update(delta : number): void {
        let callBackList = this.callBackList;
        let thisObjectList = this.thisObjectList;
        let length = callBackList.length;

        for (let i = 0; i < length; i++) {
            callBackList[i].call(thisObjectList[i], delta);
        }

    }

}