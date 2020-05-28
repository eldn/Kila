import RenderInfo from "../renderer/RenderInfo";
import { Ticker } from "./Ticker";


export class Stats{

    public container : HTMLElement;
    public renderInfo : RenderInfo;
    public ticker : Ticker;

    constructor(ticker : Ticker, renderInfo : RenderInfo, container : HTMLElement){

        this.renderInfo = renderInfo;
        this.ticker = ticker;
        this.container = container;

        this.createContainer();
        this.start();

    }

    private createContainer() : void {
        if (this.container) {
            return;
        }
        this.container = document.createElement('div');
        this.container.style.cssText = 'position: absolute;left: 5px;top:5px;color:#000;font-size: 12px;z-index: 999999;';
        document.body.appendChild(this.container);
    }

    private getFpsInfo() : string {
        return 'fps: ' + this.ticker.getMeasuredFPS();
    }

    private getFaceCountInfo () : string  {
        return 'faceCount: ' + this.renderInfo.faceCount;
    }

    private getDrawCountInfo() : string  {
        return 'drawCount: ' + this.renderInfo.drawCount;
    }

    private getMemoryInfo(): string {
        var memory = window.performance && performance['memory'];
        if (!memory) {
            return 'memory: NaN';
        }
        return 'memory: ' + (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2) + '%';
    }

    private start() : void{
        var that = this;
        setInterval(function() {
            var info = [
                that.getFpsInfo(),
                that.getFaceCountInfo(),
                that.getDrawCountInfo(),
                that.getMemoryInfo()
            ];
            that.container.innerHTML = info.join('<br>');
        }, 1000);
    }

    public profile(name) {
        console.profile(name);
        this.ticker._tick();
        console.profileEnd(name);
    }
}