import { Game } from "../game/Game";
import { Time } from "./utils/Time";
import { InputManager } from "./input/InputManager";

export class Engine {

    private _gameWidth: number;
    private _gameHeight: number;
    private _isRunning: boolean;

    // FPS
    private _frameRate: number = 60;
    private _totalFrames: number = 0;
    private _lastUpdate: number = 0;
    private _deltaTime: number = 0.0;

    private _game: Game = null;

    public constructor(width?: number, height?: number) {
        this._gameWidth = width;
        this._gameHeight = height;
        this._isRunning = false;
        this._game = new Game();

        // FPS
        this._totalFrames = 0;
        this._lastUpdate = 0;
        this._deltaTime = 0.0;
    }

    public start(): void {
        if (this._isRunning) {
            return;
        }
        this.run();
    }

    public stop(): void {
        if (!this._isRunning) {
            return;
        }

        this._isRunning = false;
    }

    public resize(): void {

    }


    calculateDeltaTime(now: number) {
        if (!now) now = performance.now();
        this._deltaTime = (now - this._lastUpdate) / 1000;
        this._lastUpdate = now;
    }

    private run(): void {
        this._isRunning = true;

        this._deltaTime = 0;
        this._totalFrames = 0;
        this._lastUpdate = performance.now();

        // InputManager.initialize()

        this.loop();
    }

    private loop(now?: number): void {

        this.calculateDeltaTime(now);
        Time.setDelat(this._deltaTime);
        
        // let fps : number = Math.floor(1000 / this._deltaTime);
        // console.log(this._deltaTime);

        this._game.input();
        this._game.update();

        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    private render(): void {
        if (!this._isRunning) {
            return;
        }
    }
}