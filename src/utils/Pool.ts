export class Pool{


    private _cache : Object = {};

    /**
     * @constructs
     */
    constructor() {
        this._cache = {};
    }

    getClassName() : string{
        return "Pool";
    }

     /**
     * 获取对象
     * @param  {String} id
     * @return {Object}
     */
    get(id) {
        return this._cache[id];
    }

    /**
     * 获取对象
     * @param {Object} obj
     * @return {Object} [description]
     */
    getObject(obj) {
        return this._cache[obj.__cacheId];
    }

    /**
     * 增加对象
     * @param {String} id
     * @param {Object} obj
     */
    add(id, obj) {
        if (typeof obj === 'object') {
            obj.__cacheId = id;
        }
        this._cache[id] = obj;
    }

    /**
     * 移除对象
     * @param {String} id
     */
    remove(id) {
        delete this._cache[id];
    }

    /**
     * 移除对象
     * @param {Object} obj
     */
    removeObject(obj) {
        delete this._cache[obj.__cacheId];
    }

     /**
     * 移除所有对象
     */
    removeAll() {
        this._cache = {};
    }

     /**
     * 遍历所有缓存
     * @param  {Function} callback
     */
    each(callback) {
        const cache = this._cache;
        for (let id in cache) {
            callback(cache[id], id);
        }
    }

}