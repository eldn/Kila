let cachedBuffer = new ArrayBuffer(1);

export class bufferUtil{
    static getTypedArray(constructor, length) {
        this._updateBuffer(length * constructor.BYTES_PER_ELEMENT);
        return new constructor(cachedBuffer, 0, length);
    }

    static fillArrayData(typedArray, data, offset = 0) {
        for (let i = 0, l = data.length; i < l; i++) {
            typedArray[offset + i] = data[i];
        }
    }
    
    static _updateBuffer(byteSize) {
        if (cachedBuffer.byteLength < byteSize) {
            cachedBuffer = new ArrayBuffer(byteSize * 2);
        }
    }
};

export default bufferUtil;
