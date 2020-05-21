// https://github.com/egret-labs/egret-core/blob/master/src/egret/utils/HashObject.ts

export type Nullable<T> = T | null;

/**
 * The HashObject class is the base class for all objects in the Egret framework.The HashObject
 * class includes a hashCode property, which is a unique identification number of the instance.
 * @version Egret 2.4
 * @platform Web,Native
 * @language en_US
 */
/**
 * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
 * @version Egret 2.4
 * @platform Web,Native
 * @language zh_CN
 */
export interface IHashObject {
    /**
     * a unique identification number assigned to this instance.
     * @version Egret 2.4
     * @platform Web,Native
     * @readOnly
     * @language en_US
     */
    /**
     * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
     * @version Egret 2.4
     * @platform Web,Native
     * @readOnly
     * @language zh_CN
     */
    hashCode: number;
}

/**
 * @private
 * 哈希计数
 */
export let $hashCount: number = 1;

/**
 * The HashObject class is the base class for all objects in the Egret framework.The HashObject
 * class includes a hashCode property, which is a unique identification number of the instance.
 * @version Egret 2.4
 * @platform Web,Native
 * @language en_US
 */
/**
 * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
 * @version Egret 2.4
 * @platform Web,Native
 * @language zh_CN
 */
export class HashObject implements IHashObject {

    /**
     * Initializes a HashObject
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 创建一个 HashObject 对象
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public constructor() {
        this.$hashCode = $hashCount++;
    }

    getClassName() : string{
        return "HashObject";
    }

    /**
     * @private
     */
    $hashCode: number;
    /**
     * a unique identification number assigned to this instance.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public get hashCode(): number {
        return this.$hashCode;
    }

    public get id() : number{
        return this.$hashCode;
    }
}