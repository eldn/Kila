/* eslint prefer-spread: "off", prefer-rest-params:"off", no-console:"off" */

const cache = {};
const LEVEL_NONE = 0;
const LEVEL_ERROR = 1;
const LEVEL_WARN = 2;
const LEVEL_LOG = 3;

/**
 * log
 * @namespace
 */
export class log {
    public static _cache: Object = cache;
    /**
     * log级别
     * @type {Enum}
     */
    public static level: number = LEVEL_LOG;

    /**
     * 显示log, warn, error
     */
    public static LEVEL_LOG :number;
    /**
     * 显示warn, error
     */
    public static LEVEL_WARN:number;
    /**
     * 显示error
     */
    public static LEVEL_ERROR:number;
    /**
     * 不显示log, warn, error
     */
    public static LEVEL_NONE:number;
    /**
     * log，等同 console.log
     * @return {Object} this
     */
    public static log() {
        if (this.level >= LEVEL_LOG) {
            console.log.apply(console, arguments);
        }
        return this;
    }

    /**
     * log，等同 console.log
     * @return {Object} this
     */
    public static warn() {
        if (this.level >= LEVEL_WARN) {
            console.warn.apply(console, arguments);
        }
        return this;
    }

    /**
     * error，等同 console.log
     * @return {Object} this
     */
    public static error() {
        if (this.level >= LEVEL_ERROR) {
            console.error.apply(console, arguments);
        }
        return this;
    }

    /**
     * logOnce 相同 id 只 log 一次
     * @param {String} id
     * @return {Object} this
     */
    public static logOnce(id) {
        if (!cache['log_' + id]) {
            cache['log_' + id] = true;
            this.log.apply(this, Array.prototype.slice.call(arguments, 1));
        }
        return this;
    }

    /**
     * warnOnce  相同 id 只 once 一次
     * @param {String} id
     * @return {Object} this
     */
    public static warnOnce(id, msg) {
        if (!cache['warn_' + id]) {
            cache['warn_' + id] = true;
            this.warn.apply(this, msg);
        }
        return this;
    }
    
    /**
     * errorOnce 相同 id 只 error 一次
     * @param {String} id
     * @return {Object} this
     */
    public static errorOnce(id) {
        if (!cache['error_' + id]) {
            cache['error_' + id] = true;
            this.error.apply(this, Array.prototype.slice.call(arguments, 1));
        }
        return this;
    }
}
