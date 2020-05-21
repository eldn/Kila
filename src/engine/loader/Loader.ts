import { Utils } from "../math/Utils";
import BasicLoader from "./BasicLoader";

/**
 * @class
 */
class Loader{

    maxConnections: number = 2;

    
    static _loaderClassMap: Object = {};
    static _loaders: Object = {};
    /**
     * 给Loader类添加扩展Loader
     * @memberOf Loader
     * @static
     * @param {string} ext 资源扩展，如gltf, png 等
     * @param {BasicLoader} LoaderClass 用于加载的类，需要继承BasicLoader
     */
    static addLoader(ext : string, LoaderClass : any) {
        Loader._loaderClassMap[ext] = LoaderClass;
    }

    static getLoader(ext : string) {
        if (!Loader._loaders[ext]) {
            const LoaderClass = Loader._loaderClassMap[ext] ? Loader._loaderClassMap[ext] : BasicLoader;
            Loader._loaders[ext] = new LoaderClass();
        }
        return Loader._loaders[ext];
    }

    getClassName() : string{
        return "Loader";
    }


    /**
     * load
     * @param  {Object|Array} data
     * @return {Promise}
     */
    load(data : any) {
        if (data instanceof Array) {
            return Promise.all(data.map(d => this.load(d)));
        }
        const type = data.type || Utils.getExtension(data.src);
        const loader = Loader.getLoader(type);
        return loader.load(data);
    }
}

export default Loader;
