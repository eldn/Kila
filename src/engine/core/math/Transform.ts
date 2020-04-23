
import { Quaternion } from "./Quaternion";
import { Matrix4Notifier } from "./Matrix4Notifier";
import { Vector3Notifier } from "./Vector3Notifier";
import { EulerNotifier } from "./EulerNotifier";
import { EventMixin } from "../event/EventMixin";
import { log } from "../utils/Log";


export class Transform{


    private _quatDirty: boolean = false;
    private _matrixDirty: boolean = false;
    private matrixVersion: 0;


    constructor(){

        this._matrix.on('update', () => {
            this._onMatrixUpdate();
        });

        this._position.on('update', () => {
            this._onPositionUpdate();
        });

        this._scale.on('update', () => {
            this._onScaleUpdate();
        });

        this._pivot.on('update', () => {
            this._onPivotUpdate();
        });

        this._rotation.on('update', () => {
            this._onRotationUpdate();
        });

        this._quaternion.on('update', () => {
            this._onQuaternionUpdate();
        });
    }


    private _matrix: Matrix4Notifier = new Matrix4Notifier();

    private _pivot: Vector3Notifier = new Vector3Notifier(0, 0, 0);

    public get pivot(): Vector3Notifier {
        return this._pivot;
    }

    public set pivot(value: Vector3Notifier) {
        this._pivot = value;
    }

    private _position: Vector3Notifier = new Vector3Notifier();

    public get position(): Vector3Notifier {
        return this._position;
    }

    public set position(value: Vector3Notifier) {
        this._position = value;
    }

    private _scale: Vector3Notifier = new Vector3Notifier(1, 1, 1);

    public get scale(): Vector3Notifier {
        return this._scale;
    }

    public set scale(value: Vector3Notifier) {
        this._scale = value;
    }

  

    private _rotation: EulerNotifier = new EulerNotifier();

    public get rotation(): EulerNotifier {
        return this._rotation;
    }

    public set rotation(value: EulerNotifier) {
        this._rotation = value;
    }


    private _quaternion: Quaternion = new Quaternion();

    public get quaternion(): Quaternion {
        return this._quaternion;
    }

    public set quaternion(value: Quaternion) {
        this._quaternion = value;
    }


 
    public copyFrom(transform: Transform): void {
        this.position.copy(transform.position);
        this.rotation.copy(transform.rotation);
        this.scale.copy(transform.scale);
    }

    _onMatrixUpdate() {
        this.matrixVersion++;
        this.updateTransform();
    }

    _onPositionUpdate() {
        this._matrixDirty = true;
    }

    _onScaleUpdate() {
        this._matrixDirty = true;
    }

    _onPivotUpdate() {
        this._matrixDirty = true;
    }

    _onRotationUpdate() {
        this._quatDirty = true;
        this._matrixDirty = true;
    }

    _onQuaternionUpdate() {
        this._rotation.fromQuat(this._quaternion);
        this._quatDirty = false;
    }


     /**
     * 元素的矩阵
     * @type {Matrix4Notifier}
     * @readOnly
     */
    get matrix() : Matrix4Notifier {
        this.updateMatrix();
        return this._matrix;
    }
    
    set matrix(value : Matrix4Notifier) {
        log.warnOnce('Node.matrix.set', 'node.matrix is readOnly.Use node.matrix.copy instead.');
        this._matrix.copy(value);
    }

     /**
     * 更新本地矩阵
     * @return {Node} this
     */
    updateMatrix() {
        if (this._matrixDirty) {
            this._matrixDirty = false;
            this.matrixVersion++;
            this._matrix.fromRotationTranslationScaleOrigin(this.quaternion, this._position, this._scale, this._pivot, true);
        }

        return this;
    }
    

     /**
     * 更新transform属性
     * @return {Node} this
     */
    updateTransform() {
        this._matrix.decompose(this._quaternion, this._position, this._scale, this._pivot);
        this._onQuaternionUpdate();

        this._matrixDirty = false;
        return this;
    }
}