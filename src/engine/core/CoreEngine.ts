import { MessageBus } from "./message/MessageBus";
import { Ticker } from "./utils/Ticker";

export class CoreEngine {

    private _previousTime: number = 0;
  
    /**
     * Creates a new engine.
     * @param width The width of the game in pixels.
     * @param height The height of the game in pixels.
     * */
    public constructor() {
 
    }


    /**
     * Starts up this engine.
     * @param game The object containing game-specific logic.
     * @param elementName The name (id) of the HTML element to use as the viewport. Must be the id of a canvas element.
     * */
    public start( ): void {
        this.loop();
    }

    /**
     * The main game loop.
     */
    private loop(): void {
        this.update();
        requestAnimationFrame( this.loop.bind( this ) );
    }



    private update(): void {
        let delta = performance.now() - this._previousTime;

        Ticker.update(delta);
        MessageBus.update( delta );
        
        this._previousTime = performance.now();
    }


}