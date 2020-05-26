import { Utils } from "../math/Utils";
import BasicLoader from "./BasicLoader";



declare type loaderConstructor =  new () => BasicLoader;

class Loader{

    
    public static _loaderClassMap: {[key : string] : loaderConstructor} = {};
    public static _loaders: Object = {};

    /**
     * 给Loader类添加扩展Loader
     * @param ext 资源扩展，如gltf, png 等
     * @param LoaderClass 用于加载的类，需要继承BasicLoader
     */
    public static addLoader(ext : string, LoaderClass : loaderConstructor) : void {
        Loader._loaderClassMap[ext] = LoaderClass;
    }

    public static getLoader(ext : string) : BasicLoader{
        if (!Loader._loaders[ext]) {
            const LoaderClass = Loader._loaderClassMap[ext] ? Loader._loaderClassMap[ext] : BasicLoader;
            Loader._loaders[ext] = new LoaderClass();
        }
        return Loader._loaders[ext];
    }

    public getClassName() : string{
        return "Loader";
    }


    /**
     * load
     * @param  data
     * @returns
     */
    public load(data : any | Array<any>) : Promise<any> {
        if (data instanceof Array) {
            return Promise.all(data.map(d => this.load(d)));
        }
        const type = data.type || Utils.getExtension(data.src);
        const loader = Loader.getLoader(type);
        return loader.load(data);
    }
}

export default Loader;
