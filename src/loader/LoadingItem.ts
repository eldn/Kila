export interface LoadingItem{
    /**
     *资源地址
     */
    src : string;
    
    /**
     * 源类型(img, json, buffer)，不提供将根据 data.src 来判断类型
     */
    type : "img" | "json" | "buffer";

    /**
     * 默认源类型
     */
    defaultType : "img" | "json" | "buffer";

    /**
     * 跨域
     *
     */
    crossOrigin : boolean;
}