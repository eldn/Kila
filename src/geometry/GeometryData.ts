import math from "../math/math";
import { log } from "../utils/Log";
import { Utils } from "../math/Utils";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import { Vector4 } from "../math/Vector4";
import { Matrix4 } from "../math/Matrix4";


const sizeVectorMap = {
    2: new Vector2(),
    3: new Vector3(),
    4: new Vector4(),
    16: new Matrix4()
};


export class GeometryData{

    private _data : any;

    private subDataList : Array<any>;

    /**
     * The number of components per vertex attribute.Must be 1, 2, 3, or 4.
     */
    public size: number;

    /**
     * Whether integer data values should be normalized when being casted to a float.
     */
    public normalized: boolean = false;

     /**
     * The data type of each component in the array.
     */
    public type: number;

    private _isSubDirty:  boolean = false;
    private _isAllDirty: boolean = false;

  
    get isDirty() {
        return this._isSubDirty || this._isAllDirty;
    }
    
    set isDirty(value) {
        this._isAllDirty = value;
        if (value === false) {
            this.clearSubData();
        }
    }
    
 
    public bufferViewId: string;
    public glBuffer: Buffer;
    public id : string;

     /**
     * @constructs
     * @param   data  数据
     * @param  size The number of components per vertex attribute.Must be 1, 2, 3, or 4.
     * @param  params 初始化参数，所有params都会复制到实例上
     */
    constructor(data : any, size : number) {
        
        this.id = math.generateUUID(this.getClassName());
        this.data = data;
        this.size = size;

        if (!this.bufferViewId) {
            this.bufferViewId = this.id;
        }

        if (!this.size) {
            log.warn('GeometryData.constructor: geometryData must set size!', this);
        }
    }

    public getClassName() : string{
        return "GeometryData";
    }


    private _stride: number = 0;

    /**
     * The offset in bytes between the beginning of consecutive vertex attributes.
     */
    get stride() : number {
        return this._stride;
    }

    set stride(value) {
        this._stride = value;
        this.strideSize = value === 0 ? 0 : value / this.data.BYTES_PER_ELEMENT;
    }
    
    public strideSize: number = 0;

    private _offset: number = 0;

     /**
     * An offset in bytes of the first component in the vertex attribute array. Must be a multiple of type.
     */
    get offset() : number{
        return this._offset;
    }

    set offset(value : number) {
        this._offset = value;
        this.offsetSize = value / this.data.BYTES_PER_ELEMENT;
    }

    offsetSize:  number = 0;
    
  
    set data(data : any) {
        if (data) {
            this._data = data;
            this.type = Utils.getTypedArrayGLType(data);
            this.stride = this._stride;
            this.offset = this._offset;
            this._isAllDirty = true;
        }
    }
    
    get data() {
        return this._data;
    }


    get length() : number {
        return this._data.length;
    }
    

    get realLength() : number{
        if (this.strideSize === 0) {
            return this._data.length;
        }
        return this._data.length / this.strideSize * this.size;
    }
    
    /**
     * 获取数据大小，单位为字节
     * @returns 数据大小
     */
    getByteLength() : number {
        return this._data.BYTES_PER_ELEMENT * this.realLength;
    }

    get count() : number {
        if (this.strideSize === 0) {
            return this._data.length / this.size;
        }
        return this._data.length / this.strideSize;
    }
    
    /**
     * 更新部分数据
     * @param offset 偏移index
     * @param  data 数据
     */
    public setSubData(offset : number, data : any) : void{
        this._isSubDirty = true;
        this.data.set(data, offset);

        if (!this.subDataList) {
            this.subDataList = [];
        }

        const byteOffset = data.BYTES_PER_ELEMENT * offset;
        this.subDataList.push({
            byteOffset,
            data
        });
    }

    /**
     * 清除 subData
     */
    public clearSubData() {
        if (this.subDataList) {
            this.subDataList.length = 0;
        }
        this._isSubDirty = false;
    }


    /**
     * clone
     * @returns
     */
    public clone() : GeometryData {
        const res = new GeometryData(null, 1);
        res.copy(this);
        return res;
    }

    /**
     * copy
     * @param  geometryData
     */
    public copy(geometryData : GeometryData) : void{
        const data = geometryData.data;
        this.data = new data.constructor(data);
        this.size = geometryData.size;
        this.stride = geometryData.stride;
        this.normalized = geometryData.normalized;
        this.type = geometryData.type;
        this.offset = geometryData.offset;
    }

    /**
     * 获取偏移值
     * @param  index
     * @returns
     */
    public getOffset(index : number) : number{
        const strideSize = this.strideSize;
        if (strideSize === 0) {
            return index * this.size;
        }
        return index * strideSize + this.offsetSize;
    }

    /**
     * 获取值
     * @param index
     * @returns
     */
    public get(index : number) : any {
        const offset = this.getOffset(index);
        return this.getByOffset(offset);
    }

    /**
     * 设置值
     * @param  index
     * @param  value
     */
    public set(index : number, value : any) {
        const offset = this.getOffset(index);
        this.setByOffset(offset, value);
        return offset;
    }

    /**
     * 根据 offset 获取值
     * @param   offset
     * @returns
     */
    public getByOffset(offset : number) : any{
        const size = this.size;
        if (size > 1) {
            const tempVector = sizeVectorMap[size];
            return tempVector.fromArray(this._data, offset);
        }

        return this._data[offset];
    }

     /**
     * 根据 offset 设置值
     * @param  offset
     * @param } value
     */
    public setByOffset(offset, value) {
        const size = this.size;
        const data = this._data;
        if (size > 1) {
            value.toArray(data, offset);
        } else {
            data[offset] = value;
        }
        this._isAllDirty = true;
    }

     /**
     * 按 index 遍历
     * @param  callback(attribute, index, offset)
     * @returns
     */
    public traverse(callback : Function) : boolean {
        const count = this.count;
        for (let index = 0; index < count; index++) {
            const offset = this.getOffset(index);
            const attribute = this.getByOffset(offset);
            if (callback(attribute, index, offset)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 按 Component 遍历 Component
     * @param   callback(data, offset)
     * @returns
     */
    public traverseByComponent(callback : Function) : boolean {
        const count = this.count;
        const size = this.size;
        const data = this._data;
        for (let index = 0; index < count; index++) {
            const offset = this.getOffset(index);
            const componentIndex = index * size;
            for (let i = 0; i < size; i++) {
                const componentOffset = offset + i;
                if (callback(data[componentOffset], componentIndex + i, componentOffset)) {
                    return true;
                }
            }
        }

        return false;
    }

    public merge(geometryData : GeometryData, transform ?: any) : GeometryData{
        if (geometryData.type !== this.type || geometryData.size !== this.size) {
            log.warn('geometryData type or size not same, cannot merge!', this, geometryData);
            return this;
        }

        const DataClass = Utils.getTypedArrayClass(this.type);
        const length0 = this.realLength;
        const length1 = geometryData.realLength;

        const newData = new DataClass(length0 + length1);
        this.traverseByComponent((data, index) => {
            newData[index] = data;
        });
        geometryData.traverseByComponent((data, index) => {
            if (transform) {
                data = transform(data, index);
            }
            newData[length0 + index] = data;
        });

        this.stride = 0;
        this.offset = 0;
        this.data = newData;

        return this;
    }

}